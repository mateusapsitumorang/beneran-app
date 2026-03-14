const GROQ_KEY = import.meta.env.VITE_GROQ_KEY

const SYSTEM_PROMPT = `Kamu adalah "Beneran AI" — asisten keamanan digital yang ramah dan terpercaya untuk pengguna Indonesia.

Keahlianmu meliputi:
- Mendeteksi dan menjelaskan modus penipuan online (scam, phishing, hoax)
- Memberikan panduan keamanan akun media sosial, email, dan m-banking
- Membantu korban penipuan mengetahui langkah yang harus diambil
- Tips belanja online yang aman
- Edukasi tentang privasi digital dan keamanan data

DATA KONTAK RESMI:
- BCA: 1500888 | BRI: 14017 | Mandiri: 14000 | BNI: 1500046 | BSI: 14040
- GoPay/OVO/Dana: buka app → Pusat Bantuan
- Patroli Siber Polri: patrolisiber.id atau 110
- Kominfo: 159

ATURAN:
- Bahasa Indonesia santai tapi profesional
- Jawaban langsung dan spesifik, maksimal 4 paragraf
- Kalau ada kontak bank yang ditanya, langsung berikan nomornya
- Jangan jawab di luar topik keamanan digital

Identitasmu: Bagian dari platform "Beneran?" — portal perlindungan digital Indonesia.`

// Fungsi streaming — pakai fetch langsung karena axios tidak support streaming
export async function kirimPesanStream(riwayatChat, onChunk, onDone, onError) {
  if (!GROQ_KEY) {
    onError('VITE_GROQ_KEY belum diisi di file .env')
    return
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        temperature: 0.7,
        stream: true, // <-- inilah kunci streaming
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...riwayatChat,
        ],
      }),
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error?.message || `HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Decode chunk yang masuk
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        // Format SSE dari Groq: "data: {...}"
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6) // hapus "data: "
        if (data === '[DONE]') {
          onDone(fullText)
          return
        }

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            fullText += content
            onChunk(content, fullText) // kirim per potongan ke UI
          }
        } catch {
          // Skip kalau JSON tidak valid
        }
      }
    }

    onDone(fullText)
  } catch (err) {
    if (err.name === 'AbortError') return
    onError(err.message)
  }
}