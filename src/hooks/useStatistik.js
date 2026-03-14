import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export function useStatistik() {
  const [statistik, setStatistik] = useState({
    total_scan: 0,
    scan_bahaya: 0,
    scan_waspada: 0,
    scan_aman: 0,
  })
  const [loading, setLoading] = useState(true)

  async function fetchStatistik() {
    // Ambil total semua waktu
    const { data } = await supabase
      .from('statistik_harian')
      .select('total_scan, scan_bahaya, scan_waspada, scan_aman')

    if (data && data.length > 0) {
      const total = data.reduce((acc, row) => ({
        total_scan: acc.total_scan + row.total_scan,
        scan_bahaya: acc.scan_bahaya + row.scan_bahaya,
        scan_waspada: acc.scan_waspada + row.scan_waspada,
        scan_aman: acc.scan_aman + row.scan_aman,
      }), { total_scan: 0, scan_bahaya: 0, scan_waspada: 0, scan_aman: 0 })

      setStatistik(total)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStatistik()

    // Real-time subscription — update otomatis kalau ada scan baru
    const channel = supabase
      .channel('statistik-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'statistik_harian',
      }, () => {
        fetchStatistik() // Refresh data kalau ada perubahan
      })
      .subscribe()

    // Refresh setiap 30 detik sebagai backup
    const interval = setInterval(fetchStatistik, 30000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  return { statistik, loading }
}