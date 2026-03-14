import axios from 'axios'
import { supabase } from './supabase'

export function deteksiTipeInput(teks) {
  const trimmed = teks.trim()
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i
  const rekeningRegex = /^\d{8,16}$/
  if (urlRegex.test(trimmed)) return 'link'
  if (rekeningRegex.test(trimmed)) return 'rekening'
  return 'teks'
}

// =============================================
// VIRUSTOTAL — Cek URL dengan 70+ antivirus
// =============================================
async function cekVirusTotal(url) {
  const VT_KEY = import.meta.env.VITE_VIRUSTOTAL_KEY
  if (!VT_KEY) {
    console.warn('VT Key tidak ada!')
    return null
  }

  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    console.log('Mengirim ke VirusTotal:', fullUrl)

    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      new URLSearchParams({ url: fullUrl }),
      {
        headers: {
          'x-apikey': VT_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const analysisId = submitResponse.data.data.id
    console.log('Analysis ID:', analysisId)

    await new Promise(resolve => setTimeout(resolve, 4000))

    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      { headers: { 'x-apikey': VT_KEY } }
    )

    const attrs = resultResponse.data.data.attributes
    console.log('Status VT:', attrs.status)
    console.log('Stats VT:', attrs.stats)

    // Kalau masih queued, tunggu lagi
    if (attrs.status === 'queued' || attrs.status === 'in-progress') {
      console.log('Masih diproses, tunggu 3 detik lagi...')
      await new Promise(resolve => setTimeout(resolve, 3000))

      const retryResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        { headers: { 'x-apikey': VT_KEY } }
      )
      const retryAttrs = retryResponse.data.data.attributes
      console.log('Stats VT (retry):', retryAttrs.stats)

      const stats = retryAttrs.stats
      return {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        total: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0),
      }
    }

    const stats = attrs.stats
    return {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      total: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0),
    }

  } catch (err) {
    console.error('VirusTotal error detail:', err.response?.data || err.message)
    return null
  }
}

// =============================================
// CEK LINK — Google Safe Browsing + Pattern
// =============================================
async function cekLink(url) {
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_KEY
  let domain = url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase()

  // === CEK 1: Database Blacklist Supabase ===
  const { data: blacklistData } = await supabase
    .from('blacklist')
    .select('*')
    .eq('tipe', 'domain')
    .eq('nilai', domain)
    .single()

  if (blacklistData) {
    return {
      status: 'bahaya',
      alasan: [
        `Domain "${domain}" ada di database hitam Beneran`,
        `Dilaporkan ${blacklistData.jumlah_laporan} kali oleh pengguna`,
      ],
      saran: 'Jangan buka link ini. Hapus pesan dan blokir pengirimnya.',
      sumber: 'Database Beneran',
      detail: null,
    }
  }

  // === CEK 2: VirusTotal + Google Safe Browsing (paralel) ===
  // Jalankan keduanya bersamaan agar lebih cepat
  const [vtHasil, googleHasil] = await Promise.allSettled([
    cekVirusTotal(url),
    GOOGLE_KEY ? cekGoogleSafeBrowsing(url, GOOGLE_KEY) : Promise.resolve(null),
  ])

  const vtData = vtHasil.status === 'fulfilled' ? vtHasil.value : null
  const googleData = googleHasil.status === 'fulfilled' ? googleHasil.value : null

  // Proses hasil VirusTotal
  if (vtData) {
    if (vtData.malicious >= 3) {
      return {
        status: 'bahaya',
        alasan: [
          `Terdeteksi berbahaya oleh ${vtData.malicious} dari ${vtData.total} antivirus`,
          vtData.suspicious > 0 ? `${vtData.suspicious} antivirus mencurigai link ini` : null,
        ].filter(Boolean),
        saran: 'Link ini berbahaya menurut banyak antivirus. Jangan dibuka.',
        sumber: 'VirusTotal + Google Safe Browsing',
        detail: vtData,
      }
    }
    if (vtData.malicious >= 1 || vtData.suspicious >= 2) {
      return {
        status: 'waspada',
        alasan: [
          `${vtData.malicious} antivirus mendeteksi bahaya`,
          `${vtData.suspicious} antivirus mencurigai link ini`,
        ],
        saran: 'Beberapa antivirus mencurigai link ini. Lebih baik hindari.',
        sumber: 'VirusTotal',
        detail: vtData,
      }
    }
  }

  // Proses hasil Google Safe Browsing
  if (googleData?.adaAncaman) {
    return {
      status: 'bahaya',
      alasan: googleData.alasan,
      saran: 'Link ini terdeteksi berbahaya oleh Google Safe Browsing.',
      sumber: 'Google Safe Browsing',
      detail: null,
    }
  }

  // === CEK 3: Pattern Detection Lokal (fallback) ===
  const warningPatterns = [
    { pola: /gratis|hadiah|menang|bonus|jackpot/i, pesan: 'Mengandung iming-iming hadiah' },
    { pola: /klik.{0,10}sekarang|segera.{0,10}klik/i, pesan: 'Teknik urgensi "klik sekarang"' },
    { pola: /\.xyz|\.top|\.click|\.buzz|\.pw|\.tk/i, pesan: 'Ekstensi domain berisiko tinggi' },
    { pola: /tokopedia|shopee|gojek|bca|mandiri|bri|bni/i, pesan: 'Mencatut nama brand terkenal' },
    { pola: /login|verify|verifikasi|konfirmasi/i, pesan: 'Meminta login atau verifikasi' },
  ]

  const temuan = warningPatterns.filter(p => p.pola.test(url))

  if (temuan.length >= 2) {
    return {
      status: 'bahaya',
      alasan: temuan.map(t => t.pesan),
      saran: 'Link ini memiliki banyak ciri penipuan.',
      sumber: 'Analisis Pola Lokal',
      detail: null,
    }
  }
  if (temuan.length === 1) {
    return {
      status: 'waspada',
      alasan: temuan.map(t => t.pesan),
      saran: 'Ada indikasi mencurigakan. Verifikasi ke website resmi.',
      sumber: 'Analisis Pola Lokal',
      detail: null,
    }
  }

  // Kalau semua aman
  const sumberDigunakan = [
    vtData ? 'VirusTotal' : null,
    googleData ? 'Google Safe Browsing' : null,
    'Database Beneran',
  ].filter(Boolean).join(' + ')

  return {
    status: 'aman',
    alasan: [
      vtData ? `Diperiksa ${vtData.total} antivirus — tidak ada ancaman` : null,
      'Tidak ditemukan di database hitam',
    ].filter(Boolean),
    saran: 'Tetap waspada meski hasil scan aman.',
    sumber: sumberDigunakan,
    detail: vtData,
  }
}

// Helper: Google Safe Browsing jadi fungsi terpisah
async function cekGoogleSafeBrowsing(url, apiKey) {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`
  const response = await axios.post(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
    {
      client: { clientId: 'beneran-app', clientVersion: '1.0.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: fullUrl }],
      },
    }
  )

  const adaAncaman = response.data.matches?.length > 0
  return {
    adaAncaman,
    alasan: adaAncaman
      ? response.data.matches.map(m => ({
          MALWARE: 'Mengandung malware/virus',
          SOCIAL_ENGINEERING: 'Terdeteksi sebagai phishing',
          UNWANTED_SOFTWARE: 'Mengandung software berbahaya',
        }[m.threatType] || m.threatType))
      : [],
  }
}

// =============================================
// CEK REKENING — Supabase Blacklist
// =============================================
async function cekRekening(nomor) {
  const { data } = await supabase
    .from('blacklist')
    .select('*')
    .eq('tipe', 'rekening')
    .eq('nilai', nomor)
    .maybeSingle()

  if (data) {
    return {
      status: data.status === 'terbukti' ? 'bahaya' : 'waspada',
      alasan: [
        `Rekening dilaporkan sebanyak ${data.jumlah_laporan} kali`,
        `Bank: ${data.nama_bank || 'Tidak diketahui'}`,
        `Status verifikasi: ${data.status}`,
      ],
      saran: 'Jangan transfer ke rekening ini. Hubungi penjual lewat platform resmi.',
      sumber: 'Database Beneran',
    }
  }

  return {
    status: 'aman',
    alasan: ['Rekening belum pernah dilaporkan di database kami'],
    saran: 'Tetap waspada. Pastikan kamu kenal baik penerimanya sebelum transfer.',
    sumber: 'Database Beneran',
  }
}

// =============================================
// ANALISIS TEKS — OpenAI GPT + Fallback Lokal
// =============================================
async function analisisTeks(teks) {
  const GROQ_KEY = import.meta.env.VITE_GROQ_KEY

  if (GROQ_KEY) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant', // Model gratis dan cepat dari Groq
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: `Kamu adalah ahli keamanan siber Indonesia yang bertugas mendeteksi penipuan.
Analisis teks berikut dan tentukan apakah mengandung pola penipuan online.

Kembalikan HANYA JSON dengan format ini tanpa teks tambahan apapun:
{
  "status": "aman" atau "waspada" atau "bahaya",
  "alasan": ["alasan 1", "alasan 2"],
  "saran": "saran tindakan singkat dalam bahasa Indonesia"
}

Kriteria penilaian:
- "bahaya": ada desakan transfer, minta OTP/PIN/password, klaim hadiah palsu, ancaman blokir akun
- "waspada": ada iming-iming tidak realistis, meminta data pribadi, tekanan waktu
- "aman": percakapan normal tanpa manipulasi`,
            },
            {
              role: 'user',
              content: teks,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const content = response.data.choices[0].message.content

      // Bersihkan response kalau ada markdown code block
      const cleaned = content.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)

      return {
        ...parsed,
        sumber: 'Analisis AI (Groq Llama 3.1)',
      }
    } catch (err) {
      console.warn('Groq gagal, fallback ke pattern lokal:', err.message)
    }
  }

  // Fallback pattern detection (sama seperti sebelumnya)
  const patterns = [
    { pola: /menang|terpilih|selamat.{0,20}(anda|kamu)/i, bobot: 30, pesan: 'Klaim kemenangan tanpa konteks' },
    { pola: /klik.{0,15}link|buka.{0,15}link/i, bobot: 20, pesan: 'Meminta klik link segera' },
    { pola: /jangan.{0,10}(beritahu|kasih tahu)/i, bobot: 25, pesan: 'Meminta merahasiakan informasi' },
    { pola: /transfer.{0,20}(sekarang|segera|cepat)/i, bobot: 35, pesan: 'Desakan transfer uang segera' },
    { pola: /pin|password|otp|kode.{0,10}rahasia/i, bobot: 40, pesan: 'Meminta PIN / OTP / password' },
    { pola: /verifikasi.{0,20}akun|akun.{0,20}diblokir/i, bobot: 25, pesan: 'Ancaman pemblokiran akun' },
    { pola: /hadiah|bonus|cashback|promo/i, bobot: 10, pesan: 'Iming-iming hadiah atau bonus' },
    { pola: /mama|papa|nak|ini (saya|aku)/i, bobot: 30, pesan: 'Pola "mama minta pulsa"' },
    { pola: /rp\s?\d+|juta|miliar/i, bobot: 15, pesan: 'Menyebut nominal uang besar' },
  ]

  const temuan = patterns.filter(p => p.pola.test(teks))
  const totalBobot = temuan.reduce((sum, p) => sum + p.bobot, 0)

  if (totalBobot >= 50) {
    return {
      status: 'bahaya',
      alasan: temuan.map(t => t.pesan),
      saran: 'Pesan ini sangat mencurigakan. Blokir pengirim dan jangan ikuti instruksinya.',
      sumber: 'Analisis Pola Lokal',
    }
  }
  if (totalBobot >= 20) {
    return {
      status: 'waspada',
      alasan: temuan.map(t => t.pesan),
      saran: 'Ada pola mencurigakan. Konfirmasi langsung ke pihak resminya.',
      sumber: 'Analisis Pola Lokal',
    }
  }

  return {
    status: 'aman',
    alasan: ['Tidak ditemukan pola manipulasi yang signifikan'],
    saran: 'Tetap berhati-hati, terutama jika pesan dari orang tidak dikenal.',
    sumber: 'Analisis Pola Lokal',
  }
}
// =============================================
// FUNGSI UTAMA — Dipanggil dari UI
// =============================================
export async function jalankanScan(input) {
  const tipe = deteksiTipeInput(input.trim())
  let hasil

  if (tipe === 'rekening') hasil = await cekRekening(input.trim())
  else if (tipe === 'link') hasil = await cekLink(input.trim())
  else hasil = await analisisTeks(input.trim())

  return { ...hasil, tipeInput: tipe }
}