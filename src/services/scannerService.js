import axios from 'axios'
import { supabase } from './supabase'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_KEY

// --- Fungsi 1: Deteksi jenis input ---
export function deteksiTipeInput(teks) {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i
  const rekeningRegex = /^\d{8,16}$/
  
  if (urlRegex.test(teks.trim())) return 'link'
  if (rekeningRegex.test(teks.trim())) return 'rekening'
  return 'teks'
}

// --- Fungsi 2: Cek link ke Google Safe Browsing ---
export async function cekLinkKeamanan(url) {
  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_API_KEY}`,
      {
        client: { clientId: 'beneran-app', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      }
    )
    
    const adaAncaman = response.data.matches && response.data.matches.length > 0
    
    return {
      status: adaAncaman ? 'bahaya' : 'aman',
      alasan: adaAncaman
        ? response.data.matches.map(m => `Terdeteksi sebagai ${m.threatType}`)
        : ['Tidak ditemukan ancaman di database Google Safe Browsing'],
      sumber: 'Google Safe Browsing API'
    }
  } catch (error) {
    console.error('Error cek link:', error)
    throw new Error('Gagal memeriksa keamanan link')
  }
}

// --- Fungsi 3: Cek nomor rekening ke database blacklist ---
export async function cekRekening(nomorRekening) {
  const { data, error } = await supabase
    .from('blacklist')
    .select('*')
    .eq('tipe', 'rekening')
    .eq('nilai', nomorRekening)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error('Gagal memeriksa database rekening')
  }

  if (data) {
    return {
      status: data.status === 'terbukti' ? 'bahaya' : 'waspada',
      alasan: [`Rekening ini dilaporkan ${data.jumlah_laporan} kali`, `Status: ${data.status}`],
      detailLaporan: data
    }
  }

  return {
    status: 'aman',
    alasan: ['Nomor rekening ini belum pernah dilaporkan di database kami'],
    catatan: 'Tetap waspada. Tidak ada di database bukan berarti 100% aman.'
  }
}

// --- Fungsi 4: Analisis teks dengan AI (via OpenAI) ---
export async function analisisTeksScam(teks) {
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah ahli keamanan siber Indonesia. Analisis teks berikut dan tentukan apakah mengandung pola penipuan.
Berikan respons dalam format JSON:
{
  "status": "aman" | "waspada" | "bahaya",
  "skor_risiko": 0-100,
  "pola_terdeteksi": ["daftar pola yang ditemukan"],
  "alasan": "penjelasan singkat dalam bahasa Indonesia",
  "saran": "saran tindakan untuk pengguna"
}`
          },
          { role: 'user', content: teks }
        ],
        response_format: { type: 'json_object' }
      },
      { headers: { Authorization: `Bearer ${OPENAI_KEY}` } }
    )
    
    return JSON.parse(response.data.choices[0].message.content)
  } catch (error) {
    throw new Error('Gagal menganalisis teks')
  }
}

// --- Fungsi 5: Orkestrator utama (ini yang dipanggil dari UI) ---
export async function jalankanScan(input) {
  const tipe = deteksiTipeInput(input)
  let hasil = {}

  if (tipe === 'link') {
    hasil = await cekLinkKeamanan(input)
  } else if (tipe === 'rekening') {
    hasil = await cekRekening(input)
  } else {
    hasil = await analisisTeksScam(input)
  }

  // Catat statistik scan ke Supabase
  await supabase.rpc('increment_scan_count') // Buat fungsi ini di Supabase SQL

  return { ...hasil, tipeInput: tipe }
}