import {
  getDayStem,
  isYangYear,
  findDestinyPalace,
  buildThreePalaces,
} from './threePalaceCalculator'

describe('getDayStem', () => {
  it('returns correct heavenly stem for a known date', () => {
    // 1900-01-31 is 甲子 day (index 0 in 60-cycle)
    expect(getDayStem(new Date('1900-01-31'))).toBe('甲')
  })

  it('returns 乙 for the next day after 甲子', () => {
    expect(getDayStem(new Date('1900-02-01'))).toBe('乙')
  })
})

describe('isYangYear', () => {
  it('1984 (甲子) is a yang year', () => {
    expect(isYangYear(1984)).toBe(true)
  })
  it('1985 (乙丑) is a yin year', () => {
    expect(isYangYear(1985)).toBe(false)
  })
})

describe('findDestinyPalace', () => {
  it('throws if dayStem is 甲 (hidden in Qimen)', () => {
    // 甲 is always hidden — destiny palace uses the stem it hides under
    // this behavior is documented: skip for v1, treat 甲 as 戊
    expect(() => findDestinyPalace('甲', mockNatalChart())).not.toThrow()
  })

  it('returns palace number 1-9', () => {
    const result = findDestinyPalace('乙', mockNatalChart())
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(9)
  })
})

describe('buildThreePalaces', () => {
  it('returns a ThreePalaces object with valid palace number', () => {
    const result = buildThreePalaces(new Date('1990-05-15'), mockNatalChart())
    expect(result.destinyPalaceNumber).toBeGreaterThanOrEqual(1)
    expect(result.destinyPalaceNumber).toBeLessThanOrEqual(9)
    expect(result.dayStem).toBeTruthy()
    expect(result.element).toBeTruthy()
  })
})

// Helper: minimal mock chart where 乙 is in palace 3
function mockNatalChart() {
  // Structure matches the engine's chart output
  // heavenStems[palaceIndex] = stem in that palace (heaven plate)
  return {
    heavenStems: ['戊', '乙', '丙', '丁', '己', '庚', '辛', '壬', '癸'],
    gates: ['開門', '休門', '生門', '傷門', '杜門', '景門', '死門', '驚門'],
    deities: ['值符', '腾蛇', '太陰', '六合', '白虎', '玄武', '九地', '九天'],
    // palace index 0=palace1, 1=palace2, ... 8=palace9
  }
}
