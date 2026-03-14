import { useState, useCallback, useRef } from 'react'
import { kirimPesanStream } from '../services/chatService'
import { cekRateLimit } from '../utils/rateLimiter'


const PESAN_AWAL = {
  role: 'assistant',
  content: 'Halo! Saya **Beneran AI**, asisten keamanan digital kamu 👋\n\nKamu bisa tanya apa saja seputar:\n- 🔍 Cek apakah pesan/link mencurigakan\n- 🔐 Cara mengamankan akun\n- 🛒 Tips belanja online aman\n- 🆘 Panduan jika sudah tertipu\n\nAda yang bisa saya bantu?',
  id: 'welcome',
}

export function useChat() {
  const [messages, setMessages] = useState([PESAN_AWAL])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const streamingIdRef = useRef(null) // ID pesan yang sedang di-stream

  const kirim = useCallback(async (teksUser) => {
    if (!teksUser.trim() || isStreaming) return

     // Cek rate limit
  const { diizinkan, pesan } = cekRateLimit('chat')
  if (!diizinkan) {
    setError(pesan)
    return
  }

    const pesanUser = { role: 'user', content: teksUser, id: Date.now() }
    const idBalasan = Date.now() + 1

    // Tambah pesan user + placeholder pesan AI kosong
    setMessages(prev => [
      ...prev,
      pesanUser,
      { role: 'assistant', content: '', id: idBalasan, isStreaming: true },
    ])
    setIsStreaming(true)
    setError(null)
    streamingIdRef.current = idBalasan

    // Siapkan riwayat untuk dikirim ke API
    const riwayat = [...messages, pesanUser].map(({ role, content }) => ({ role, content }))
    const riwayatTerbatas = riwayat.slice(-10) // maks 10 pesan terakhir

    kirimPesanStream(
      riwayatTerbatas,

      // onChunk — dipanggil setiap ada potongan teks baru
      (chunk, fullText) => {
        setMessages(prev => prev.map(msg =>
          msg.id === idBalasan
            ? { ...msg, content: fullText, isStreaming: true }
            : msg
        ))
      },

      // onDone — dipanggil saat streaming selesai
      (fullText) => {
        setMessages(prev => prev.map(msg =>
          msg.id === idBalasan
            ? { ...msg, content: fullText, isStreaming: false }
            : msg
        ))
        setIsStreaming(false)
        streamingIdRef.current = null
      },

      // onError — dipanggil kalau ada error
      (errMsg) => {
        setMessages(prev => prev.filter(msg => msg.id !== idBalasan))
        if (errMsg.includes('429')) {
          setError('Terlalu banyak permintaan. Tunggu beberapa detik.')
        } else if (errMsg.includes('401')) {
          setError('API key Groq tidak valid. Periksa file .env kamu.')
        } else {
          setError(`Gagal: ${errMsg}`)
        }
        setIsStreaming(false)
      }
    )
  }, [messages, isStreaming])

  const reset = useCallback(() => {
    setMessages([{ ...PESAN_AWAL, id: Date.now() }])
    setError(null)
    setIsStreaming(false)
  }, [])

  return { messages, isStreaming, error, kirim, reset }
}