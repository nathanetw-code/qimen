// src/app/types.ts
//
// Engine findings (src/qimen/QimenUtil.ts):
//   Chart function: QimenUtil.create(lunar: Lunar): QimenPan
//     - Takes a Lunar instance (from lunar-typescript: Lunar.fromYmdHms(y, m, d, h, min, s))
//     - Returns QimenPan
//   Engine chart structure (QimenPan, defined in src/qimen/type.ts):
//     - 九宮: QimenCell[]         — array of 9 palace cells
//     - 八字: 八字                — four-pillars (year/month/day/hour stems)
//     - 值符落宮: 宮位             — palace where 值符 deity resides
//     - 值使門: 八門              — gate of the emissary
//     - 旬首: 旬首                — sexagenary cycle head
//     - 遁干: 天干                — hidden stem
//     - 局數: 局數                — inning number (1–9)
//     - 遁: 遁                   — Yin/Yang dun
//     - 空亡: 地支[]              — void branches
//   Each QimenCell contains:
//     - 八神: 八神                — deity (e.g. "值符" | "騰蛇" | "太陰" | ...)
//     - 八門: 八門                — gate (e.g. "休門" | "生門" | ...)
//     - 天盤干: 天干[]            — heaven plate stems
//     - 地盤干: 天干[]            — earth plate stems
//     - 宮位: 宮位                — palace position string
//     - 是否空亡: boolean         — is this palace void?
//     - 是否驛馬: boolean         — is this the traveling horse palace?
//   Note: engine deity "騰蛇" uses traditional character; app DeityKey uses "腾蛇" (simplified)

// Palace numbers 1-9 following Luoshu arrangement
// 1=N(坎) 2=SW(坤) 3=E(震) 4=SE(巽) 5=Center(中) 6=NW(乾) 7=W(兌) 8=NE(艮) 9=S(離)
export type PalaceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export const PALACE_DIRECTION: Record<PalaceNumber, string> = {
  1: 'เหนือ (North)',
  2: 'ตะวันตกเฉียงใต้ (SW)',
  3: 'ตะวันออก (East)',
  4: 'ตะวันออกเฉียงใต้ (SE)',
  5: 'กลาง (Center)',
  6: 'ตะวันตกเฉียงเหนือ (NW)',
  7: 'ตะวันตก (West)',
  8: 'ตะวันออกเฉียงเหนือ (NE)',
  9: 'ใต้ (South)',
}

export type Gender = 'male' | 'female'

export type HeavenlyStem =
  | '甲' | '乙' | '丙' | '丁' | '戊'
  | '己' | '庚' | '辛' | '壬' | '癸'

export const STEM_ELEMENT: Record<HeavenlyStem, string> = {
  '甲': 'ไม้ (Wood+)', '乙': 'ไม้ (Wood-)',
  '丙': 'ไฟ (Fire+)', '丁': 'ไฟ (Fire-)',
  '戊': 'ดิน (Earth+)', '己': 'ดิน (Earth-)',
  '庚': 'ทอง (Metal+)', '辛': 'ทอง (Metal-)',
  '壬': 'น้ำ (Water+)', '癸': 'น้ำ (Water-)',
}

// Deity names and Thai descriptions
export type DeityKey =
  | '值符' | '腾蛇' | '太陰' | '六合'
  | '白虎' | '玄武' | '九地' | '九天'

export const DEITY_INFO: Record<DeityKey, { nameThai: string; power: string }> = {
  '值符': { nameThai: 'จื๋อฟู (Chief)', power: 'มงคลสุด คุ้มครอง ดึงดูด 10x' },
  '腾蛇': { nameThai: 'เถิงเสอ (Surging Snake)', power: 'Timing จังหวะ ควบคุมสถานการณ์' },
  '太陰': { nameThai: 'ไท่อิน (Moon)', power: 'ความรู้ วางแผน เบื้องหลัง สมาธิ' },
  '六合': { nameThai: 'ลิ่วเหอ (Harmony)', power: 'ทีม พาร์ทเนอร์ การเชื่อมโยง' },
  '白虎': { nameThai: 'ไป๋หู่ (White Tiger)', power: 'ความกล้า แรงกดดัน' },
  '玄武': { nameThai: 'สวนอู่ (Black Tortoise)', power: 'สัญชาตญาณ อ่านใจผู้อื่น' },
  '九地': { nameThai: 'จิ่วตี้ (Nine Earth)', power: 'สะสมทรัพย์ เยียวยา มั่นคง' },
  '九天': { nameThai: 'จิ่วเทียน (Nine Heavens)', power: 'วิสัยทัศน์ Manifestation ต่างแดน' },
}

export type GateKey =
  | '休門' | '死門' | '傷門' | '杜門'
  | '開門' | '驚門' | '生門' | '景門'

export const GATE_INFO: Record<GateKey, { nameThai: string; auspicious: boolean }> = {
  '休門': { nameThai: 'ประตูพักผ่อน (Rest)', auspicious: true },
  '死門': { nameThai: 'ประตูมรณะ (Death)', auspicious: false },
  '傷門': { nameThai: 'ประตูบาดเจ็บ (Injury)', auspicious: false },
  '杜門': { nameThai: 'ประตูปิด (Delusion)', auspicious: false },
  '開門': { nameThai: 'ประตูเปิด (Open)', auspicious: true },
  '驚門': { nameThai: 'ประตูตื่นตระหนก (Shock)', auspicious: false },
  '生門': { nameThai: 'ประตูชีวิต (Life)', auspicious: true },
  '景門': { nameThai: 'ประตูทิวทัศน์ (Scenery)', auspicious: false },
}

export type StarKey =
  | '天蓬' | '天任' | '天冲' | '天輔' | '天英'
  | '天芮' | '天柱' | '天心' | '天禽'

export const STAR_INFO: Record<StarKey, { nameThai: string; auspicious: boolean }> = {
  '天蓬': { nameThai: 'เทียนเผิง', auspicious: false },
  '天任': { nameThai: 'เทียนเริ้น', auspicious: true },
  '天冲': { nameThai: 'เทียนชง', auspicious: true },
  '天輔': { nameThai: 'เทียนฝู่', auspicious: true },
  '天英': { nameThai: 'เทียนอิง', auspicious: false },
  '天芮': { nameThai: 'เทียนรุ่ย', auspicious: false },
  '天柱': { nameThai: 'เทียนจู้', auspicious: false },
  '天心': { nameThai: 'เทียนซิน', auspicious: true },
  '天禽': { nameThai: 'เทียนฉิน', auspicious: true },
}

export const PALACE_DIR_SHORT: Record<PalaceNumber, string> = {
  1: 'N', 2: 'SW', 3: 'E', 4: 'SE', 5: '中',
  6: 'NW', 7: 'W', 8: 'NE', 9: 'S',
}

export const PALACE_TRIGRAM: Record<PalaceNumber, string> = {
  1: '坎', 2: '坤', 3: '震', 4: '巽', 5: '中',
  6: '乾', 7: '兌', 8: '艮', 9: '離',
}

export type ActivityType = 'worship' | 'chanting' | 'meditation' | 'general'

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  worship: 'ไหว้เจ้า',
  chanting: 'สวดมนต์',
  meditation: 'นั่งสมาธิ',
  general: 'ทั่วไป',
}

export interface ThreePalaces {
  destinyPalaceNumber: PalaceNumber   // วังโชคชะตา
  destinyDirection: string            // ทิศของวังโชคชะตา
  destinyDoor: GateKey                // ประตูในวังโชคชะตา
  destinyDeity: DeityKey              // เทพในวังที่ 值符 สถิต
  dayStem: HeavenlyStem               // กิ่งฟ้าวันเกิด
  element: string                     // ธาตุประจำตัว
}

export interface UserProfile {
  id: string
  birthDate: string       // YYYY-MM-DD
  birthTime: string       // HH:MM
  gender: Gender
  threePalaces: ThreePalaces
  createdAt: string
}

export interface AuspiciousHour {
  datetime: Date
  score: number
  level: 'excellent' | 'good' | 'fair'
  activity: ActivityType
  recommendedDirection: string
  reasons: string[]        // why this hour is good
  warnings: string[]       // voids or clashes
}

export interface TimingSearchParams {
  activity: ActivityType
  fromDate: Date
  toDate: Date
  timeRange: 'morning' | 'afternoon' | 'evening' | 'all'
  avoidVoid: boolean
  minLevel: 'excellent' | 'good' | 'fair'
}
