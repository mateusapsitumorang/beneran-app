const BATAS = {
  scan: { maks: 10, per: 60 * 1000 },   // maks 10 scan per menit
  chat: { maks: 20, per: 60 * 1000 },   // maks 20 chat per menit
}

const riwayatRequest = {}

export function cekRateLimit(tipe) {
  const sekarang = Date.now()
  const { maks, per } = BATAS[tipe] || BATAS.scan

  if (!riwayatRequest[tipe]) riwayatRequest[tipe] = []

  // Hapus request yang sudah lewat window waktu
  riwayatRequest[tipe] = riwayatRequest[tipe].filter(t => sekarang - t < per)

  if (riwayatRequest[tipe].length >= maks) {
    const sisaWaktu = Math.ceil((riwayatRequest[tipe][0] + per - sekarang) / 1000)
    return {
      diizinkan: false,
      pesan: `Terlalu banyak permintaan. Tunggu ${sisaWaktu} detik lagi.`,
    }
  }

  riwayatRequest[tipe].push(sekarang)
  return { diizinkan: true }
}