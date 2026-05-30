import { useState, useEffect } from 'react'

// NOTE: Replace with actual engine import after Task 10
// import { QimenUtil } from '../../qimen/QimenUtil'

export function useCurrentChart() {
  const [chart, setChart] = useState<unknown>(null)
  const [currentHour, setCurrentHour] = useState(new Date())

  useEffect(() => {
    function refresh() {
      const now = new Date()
      setCurrentHour(now)
      // TODO Task 10: setChart(QimenUtil.create(Lunar.fromDate(now)))
      setChart({ placeholder: true, time: now.toISOString() })
    }
    refresh()
    // Refresh every 2 minutes to catch hour changes
    const interval = setInterval(refresh, 120_000)
    return () => clearInterval(interval)
  }, [])

  return { chart, currentHour }
}
