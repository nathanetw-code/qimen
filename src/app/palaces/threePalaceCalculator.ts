import type { HeavenlyStem, PalaceNumber, GateKey, DeityKey, ThreePalaces } from '../types'
import { PALACE_DIRECTION, STEM_ELEMENT } from '../types'

const STEMS: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// Days since epoch reference 1900-01-31 (甲子 day = index 0 in 60-cycle)
const EPOCH = new Date('1900-01-31').getTime()
const MS_PER_DAY = 86400000

export function getDayStem(date: Date): HeavenlyStem {
  const daysSinceEpoch = Math.floor((date.getTime() - EPOCH) / MS_PER_DAY)
  const stemIndex = ((daysSinceEpoch % 10) + 10) % 10
  return STEMS[stemIndex]
}

export function isYangYear(year: number): boolean {
  // Year stem: (year - 4) % 10 gives stem index; 0,2,4,6,8 = yang
  const stemIndex = ((year - 4) % 10 + 10) % 10
  return stemIndex % 2 === 0
}

// Engine chart shape — adjust property names after inspecting actual engine output
export interface EngineChart {
  heavenStems: string[]  // index 0 = palace 1, ..., index 8 = palace 9
  gates: string[]
  deities: string[]
}

export function findDestinyPalace(dayStem: HeavenlyStem, chart: EngineChart): PalaceNumber {
  // 甲 is hidden in Qimen — treat as 戊 for v1
  const searchStem = dayStem === '甲' ? '戊' : dayStem
  const idx = chart.heavenStems.findIndex(s => s === searchStem)
  if (idx === -1) {
    // fallback: return palace 5 (center) if stem not found
    return 5
  }
  return (idx + 1) as PalaceNumber
}

export function findDoorPalace(destinyPalaceIndex: PalaceNumber, chart: EngineChart): GateKey {
  return chart.gates[destinyPalaceIndex - 1] as GateKey
}

export function findDeityPalace(chart: EngineChart): { palaceNumber: PalaceNumber; deity: DeityKey } {
  // 值符 is always in palace where 甲 (Chief) is — find it in deities array
  const idx = chart.deities.findIndex(d => d === '值符')
  const palaceNumber = idx === -1 ? 1 : ((idx + 1) as PalaceNumber)
  return { palaceNumber, deity: chart.deities[idx === -1 ? 0 : idx] as DeityKey }
}

export function buildThreePalaces(
  birthDate: Date,
  natalChart: EngineChart,
): ThreePalaces {
  const dayStem = getDayStem(birthDate)
  const destinyPalaceNumber = findDestinyPalace(dayStem, natalChart)
  const destinyDoor = findDoorPalace(destinyPalaceNumber, natalChart)
  const { deity: destinyDeity } = findDeityPalace(natalChart)

  return {
    destinyPalaceNumber,
    destinyDirection: PALACE_DIRECTION[destinyPalaceNumber],
    destinyDoor,
    destinyDeity,
    dayStem,
    element: STEM_ELEMENT[dayStem],
  }
}
