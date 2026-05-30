import { useState, useEffect } from 'react'
import { buildEngineChartFromDate } from '../palaces/threePalaceCalculator'
import type { EngineChart } from '../palaces/threePalaceCalculator'

export function useCurrentChart() {
  const [chart, setChart] = useState<EngineChart | null>(null)
  const [currentHour, setCurrentHour] = useState(new Date())

  useEffect(() => {
    function refresh() {
      const now = new Date()
      setCurrentHour(now)
      setChart(buildEngineChartFromDate(now))
    }
    refresh()
    // Refresh every 2 minutes to catch hour changes
    const interval = setInterval(refresh, 120_000)
    return () => clearInterval(interval)
  }, [])

  return { chart, currentHour }
}
