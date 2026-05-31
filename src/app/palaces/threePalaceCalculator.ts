import type { HeavenlyStem, PalaceNumber, GateKey, DeityKey, ThreePalaces } from '../types'
import { PALACE_DIRECTION, STEM_ELEMENT } from '../types'
import { Solar } from 'lunar-typescript'
import { QimenUtil } from '../../qimen/QimenUtil'

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

// Engine chart shape — index 0 = palace 1, ..., index 8 = palace 9
export interface EngineChart {
  heavenStems: string[]   // 天盤干 — heaven plate stem per palace
  earthStems: string[]    // 地盤干 — earth plate stem per palace
  stars: string[]         // 九星 — nine stars
  gates: string[]         // 八門 — eight gates
  deities: string[]       // 八神 — eight deities (normalized to simplified chars)
  isVoid: boolean[]       // 是否空亡 — is void?
  isHorse: boolean[]      // 是否驛馬 — is travelling horse?
  dun: string             // 陽遁 | 陰遁
  formation: number       // 局數 1–9
  leadStem: string        // 遁干 (chief hidden stem)
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

// Normalize traditional characters to simplified (engine uses 騰蛇, app uses 腾蛇)
function normalizeDeity(deity: string | undefined): string {
  if (!deity) return ''
  return deity.replace('騰蛇', '腾蛇')
}

export function buildEngineChartFromDate(date: Date): EngineChart {
  const solar = Solar.fromYmdHms(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  )
  const lunar = solar.getLunar()
  const pan = QimenUtil.create(lunar)
  const cells = pan.九宮  // array of 9 QimenCell

  return {
    heavenStems: cells.map(c => (c.天盤干[0] ?? '') as string),
    earthStems:  cells.map(c => (c.地盤干[0] ?? '') as string),
    stars:       cells.map(c => c.九星 as string),
    gates:       cells.map(c => (c.八門 as string) ?? ''),
    deities:     cells.map(c => normalizeDeity(c.八神 as string | undefined)),
    isVoid:      cells.map(c => c.是否空亡),
    isHorse:     cells.map(c => c.是否驛馬),
    dun:         pan.遁 as string,
    formation:   pan.局數 as number,
    leadStem:    pan.遁干 as string,
  }
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
