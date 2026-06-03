import type { ActivityType, AuspiciousHour } from '../types'
import { AstrologicalTimeUtil } from '../../qimen/AstrologicalTimeUtil'
import type { TimeType } from '../../qimen/AstrologicalTimeUtil'
import type { 天干, 地支 } from '../../qimen/type'

export interface PalaceSnapshot {
  gate: string
  deity: string
  star: string
  heavenStem: string
  earthStem: string
  hasVoid: boolean
  dayStem?: string
  hourStem?: string
  hourBranch?: string
}

interface ScoreResult {
  total: number
  reasons: string[]
  warnings: string[]
  timeType: TimeType
}

const GOOD_GATES_BY_ACTIVITY: Record<ActivityType, string[]> = {
  worship:    ['開門', '生門'],
  chanting:   ['開門'],
  meditation: ['休門'],
  general:    ['開門', '休門', '生門'],
}

const GOOD_DEITIES_BY_ACTIVITY: Record<ActivityType, string[]> = {
  worship:    ['九天', '值符'],
  chanting:   ['九天', '太陰'],
  meditation: ['太陰', '九天'],
  general:    ['值符', '九天'],
}

const GOOD_STARS_BY_ACTIVITY: Record<ActivityType, string[]> = {
  worship:    ['天心'],
  chanting:   ['天輔'],
  meditation: [],
  general:    ['天心'],
}

export function detectFormations(
  heavenStem: string,
  earthStem: string,
  gate: string,
  deity: string,
): string[] {
  const found: string[] = []
  if (heavenStem === '丁' && earthStem === '乙') found.push('Heavenly Flourish (丁+乙)')
  if (heavenStem === '乙' && earthStem === '丁') found.push('Noble Jade Maiden (乙+丁)')
  if (heavenStem === '戊' && earthStem === '丙') found.push('Green Dragon Returns (戊+丙)')
  if (heavenStem === '丙' && earthStem === '戊') found.push('Flying Bird to Cave (丙+戊)')
  // Tinka: heavenStem 乙 + 景門 + 九天
  if (heavenStem === '乙' && gate === '景門' && deity === '九天') found.push('Divine Veil (Tinka)')
  return found
}

export function scoreHour(
  palace: PalaceSnapshot,
  activity: ActivityType,
  _destinyPalaceNumber: number,
): ScoreResult {
  let total = 0
  const reasons: string[] = []
  const warnings: string[] = []

  if (GOOD_GATES_BY_ACTIVITY[activity].includes(palace.gate)) {
    total += 3
    reasons.push(`ประตูมงคล: ${palace.gate}`)
  }

  if (GOOD_DEITIES_BY_ACTIVITY[activity].includes(palace.deity)) {
    total += 2
    reasons.push(`เทพมงคล: ${palace.deity}`)
  }

  if (GOOD_STARS_BY_ACTIVITY[activity].includes(palace.star)) {
    total += 2
    reasons.push(`ดาวมงคล: ${palace.star}`)
  }

  const formations = detectFormations(palace.heavenStem, palace.earthStem, palace.gate, palace.deity)
  for (const f of formations) {
    const bonus = f.includes('Tinka') ? 5 : 3
    total += bonus
    reasons.push(f)
  }

  if (palace.hasVoid) {
    total -= 5
    warnings.push('วังว่าง (Void) — พลังงานอ่อนแอ')
  }

  // Astrological time quality check
  let timeType: TimeType = null
  if (palace.dayStem && palace.hourStem && palace.hourBranch) {
    timeType = AstrologicalTimeUtil.getType(
      palace.dayStem as 天干,
      palace.hourStem as 天干,
      palace.hourBranch as 地支,
    )
    if (timeType === '天顯時格') {
      total += 3
      reasons.push('天顯時格 — ชั่วโมงมงคลพิเศษ')
    } else if (timeType === '五不遇時') {
      total -= 3
      warnings.push('五不遇時 — เวลาที่ไม่เป็นมงคล')
    } else if (timeType === '時干入墓') {
      total -= 2
      warnings.push('時干入墓 — พลังงานชั่วโมงถูกกดทับ')
    }
  }

  return { total, reasons, warnings, timeType }
}

export function getLevel(score: number): AuspiciousHour['level'] {
  if (score >= 8) return 'excellent'
  if (score >= 4) return 'good'
  return 'fair'
}

// Generate all 12 Chinese hours for a given date
export function getChineseHours(date: Date): Date[] {
  const hours = []
  const base = new Date(date)
  base.setHours(23, 0, 0, 0)
  base.setDate(base.getDate() - 1) // 子時 starts at 23:00 previous day
  for (let i = 0; i < 12; i++) {
    const h = new Date(base)
    h.setHours(base.getHours() + i * 2)
    hours.push(h)
  }
  return hours
}
