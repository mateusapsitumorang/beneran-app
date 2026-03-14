import axios from 'axios'

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY
const ST_USER = import.meta.env.VITE_SIGHTENGINE_USER
const ST_SECRET = import.meta.env.VITE_SIGHTENGINE_SECRET

// =============================================
// HELPER: Konversi file ke Base64
// =============================================
export function fileKeBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Hapus prefix "data:image/jpeg;base64," — ambil hanya datanya
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// =============================================
// HELPER: Ekstrak frame dari video
// =============================================
export function ekstrakFrameVideo(file, jumlahFrame = 5) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const frames = []

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const durasi = video.duration

      // Ambil frame di berbagai titik waktu
      const titikWaktu = Array.from(
        { length: jumlahFrame },
        (_, i) => (durasi / (jumlahFrame + 1)) * (i + 1)
      )

      let frameKe = 0

      function ambilFrame() {
        if (frameKe >= titikWaktu.length) {
          URL.revokeObjectURL(objectUrl)
          resolve(frames)
          return
        }

        video.currentTime = titikWaktu[frameKe]
      }

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        const base64 = dataUrl.split(',')[1]
        frames.push({
          waktu: titikWaktu[frameKe].toFixed(1),
          base64,
          dataUrl,
        })
        frameKe++
        ambilFrame()
      }

      video.onerror = () => reject(new Error('Gagal memproses video'))
      ambilFrame()
    }

    video.onerror = () => reject(new Error('Format video tidak didukung'))
  })
}

// =============================================
// ANALISIS 1: Groq Vision — Deteksi Konten
// =============================================
export async function analisaGambarGroq(base64, mimeType = 'image/jpeg') {
  if (!GROQ_KEY) throw new Error('VITE_GROQ_KEY belum diisi')

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
            {
              type: 'text',
              text: `Kamu adalah ahli forensik digital dan deteksi deepfake/AI-generated content.

Analisis gambar ini dengan sangat teliti dan kembalikan HANYA JSON tanpa teks lain:

{
  "kemungkinan_ai": 0-100,
  "kemungkinan_manipulasi": 0-100,
  "tanda_tanda": ["daftar tanda yang ditemukan"],
  "area_mencurigakan": ["area gambar yang mencurigakan"],
  "kesimpulan": "aman/mencurigakan/kemungkinan_ai/kemungkinan_palsu",
  "penjelasan": "penjelasan singkat dalam bahasa Indonesia",
  "rekomendasi": "saran tindakan untuk pengguna"
}

Yang perlu dicek:
- Tanda-tanda AI generated: wajah terlalu sempurna, latar blur tidak natural, distorsi tangan/jari, teks tidak konsisten
- Tanda manipulasi: tepi tidak natural, pencahayaan tidak konsisten, artefak kompresi aneh
- Konteks hoax: teks provokatif, klaim tidak masuk akal, watermark aneh
- Metadata visual yang mencurigakan`,
            },
          ],
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
  const cleaned = content.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return {
      kemungkinan_ai: 50,
      kemungkinan_manipulasi: 50,
      tanda_tanda: ['Gagal parse hasil AI'],
      area_mencurigakan: [],
      kesimpulan: 'mencurigakan',
      penjelasan: content,
      rekomendasi: 'Analisis manual diperlukan',
    }
  }
}

// =============================================
// ANALISIS 2: Sightengine — Deteksi AI Image
// =============================================
export async function analisaSightengine(file) {
  if (!ST_USER || !ST_SECRET) return null

  try {
    const formData = new FormData()
    formData.append('media', file)
    formData.append('models', 'genai,deepfake,faces')
    formData.append('api_user', ST_USER)
    formData.append('api_secret', ST_SECRET)

    const response = await axios.post(
      'https://api.sightengine.com/1.0/check.json',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    const data = response.data
    return {
      ai_generated: data.type?.ai_generated || 0,
      deepfake: data.faces?.[0]?.deepfake || 0,
      wajah_terdeteksi: data.faces?.length || 0,
      skor_mentah: data,
    }
  } catch (err) {
    console.warn('Sightengine gagal:', err.message)
    return null
  }
}

// =============================================
// FUNGSI UTAMA: Analisis Foto
// =============================================
export async function analisaFoto(file) {
  const mimeType = file.type || 'image/jpeg'
  const base64 = await fileKeBase64(file)

  // Jalankan kedua analisis secara paralel
  const [groqHasil, stHasil] = await Promise.allSettled([
    analisaGambarGroq(base64, mimeType),
    analisaSightengine(file),
  ])

  const groq = groqHasil.status === 'fulfilled' ? groqHasil.value : null
  const st = stHasil.status === 'fulfilled' ? stHasil.value : null

  // Gabungkan skor dari kedua sumber
  let skorAI = groq?.kemungkinan_ai || 0
  let skorManipulasi = groq?.kemungkinan_manipulasi || 0

  if (st) {
    // Rata-rata dengan skor Sightengine kalau tersedia
    skorAI = Math.round((skorAI + (st.ai_generated * 100)) / 2)
    if (st.deepfake) {
      skorManipulasi = Math.round((skorManipulasi + (st.deepfake * 100)) / 2)
    }
  }

  // Tentukan status akhir
  let status
  if (skorAI >= 70 || skorManipulasi >= 70) {
    status = 'bahaya'
  } else if (skorAI >= 40 || skorManipulasi >= 40) {
    status = 'waspada'
  } else {
    status = 'aman'
  }

  return {
    tipe: 'foto',
    status,
    skorAI,
    skorManipulasi,
    groqAnalisis: groq,
    stAnalisis: st,
    tandaTanda: groq?.tanda_tanda || [],
    areaMencurigakan: groq?.area_mencurigakan || [],
    penjelasan: groq?.penjelasan || 'Tidak ada penjelasan',
    rekomendasi: groq?.rekomendasi || '',
    base64Preview: `data:${mimeType};base64,${base64}`,
  }
}

// =============================================
// FUNGSI UTAMA: Analisis Video
// =============================================
export async function analisaVideo(file, onProgress) {
  onProgress?.('Mengekstrak frame dari video...')
  const frames = await ekstrakFrameVideo(file, 5)

  const hasilPerFrame = []
  let totalAI = 0
  let totalManipulasi = 0

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i]
    onProgress?.(`Menganalisis frame ${i + 1} dari ${frames.length} (detik ke-${frame.waktu})...`)

    try {
      const hasil = await analisaGambarGroq(frame.base64)
      hasilPerFrame.push({
        ...hasil,
        waktu: frame.waktu,
        preview: frame.dataUrl,
      })
      totalAI += hasil.kemungkinan_ai || 0
      totalManipulasi += hasil.kemungkinan_manipulasi || 0
    } catch (err) {
      console.warn(`Frame ${i + 1} gagal:`, err.message)
    }

    // Jeda antar request agar tidak kena rate limit Groq
    if (i < frames.length - 1) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  const rataAI = Math.round(totalAI / (hasilPerFrame.length || 1))
  const rataManipulasi = Math.round(totalManipulasi / (hasilPerFrame.length || 1))

  // Ambil frame yang paling mencurigakan
  const frameTerburuk = hasilPerFrame.sort(
    (a, b) => (b.kemungkinan_ai + b.kemungkinan_manipulasi) - (a.kemungkinan_ai + a.kemungkinan_manipulasi)
  )[0]

  let status
  if (rataAI >= 70 || rataManipulasi >= 70) status = 'bahaya'
  else if (rataAI >= 40 || rataManipulasi >= 40) status = 'waspada'
  else status = 'aman'

  // Kumpulkan semua tanda-tanda unik dari semua frame
  const semuaTanda = [...new Set(hasilPerFrame.flatMap(f => f.tanda_tanda || []))]

  return {
    tipe: 'video',
    status,
    skorAI: rataAI,
    skorManipulasi: rataManipulasi,
    hasilPerFrame,
    frameTerburuk,
    tandaTanda: semuaTanda.slice(0, 5),
    penjelasan: frameTerburuk?.penjelasan || 'Analisis selesai',
    rekomendasi: frameTerburuk?.rekomendasi || '',
    namaFile: file.name,
    ukuranFile: (file.size / 1024 / 1024).toFixed(2),
  }
}