import { scoreHour, getLevel, detectFormations } from './auspiciousScorer'

describe('scoreHour', () => {
  it('gives +3 for Open Door on worship activity', () => {
    const score = scoreHour(
      { gate: '開門', deity: '玄武', star: '天任', heavenStem: '庚', earthStem: '壬', hasVoid: false },
      'worship',
      1
    )
    expect(score.total).toBeGreaterThanOrEqual(3)
  })

  it('gives +3 for Rest Door on meditation activity', () => {
    const score = scoreHour(
      { gate: '休門', deity: '玄武', star: '天任', heavenStem: '庚', earthStem: '壬', hasVoid: false },
      'meditation',
      1
    )
    expect(score.total).toBeGreaterThanOrEqual(3)
  })

  it('penalizes -5 for void palace', () => {
    const score = scoreHour(
      { gate: '開門', deity: '九天', star: '天心', heavenStem: '丁', earthStem: '乙', hasVoid: true },
      'worship',
      1
    )
    expect(score.total).toBeLessThan(
      scoreHour(
        { gate: '開門', deity: '九天', star: '天心', heavenStem: '丁', earthStem: '乙', hasVoid: false },
        'worship',
        1
      ).total
    )
  })

  it('gives +5 for Tinka formation (乙 + 景門 + 九天)', () => {
    const score = scoreHour(
      { gate: '景門', deity: '九天', star: '天心', heavenStem: '乙', earthStem: '甲', hasVoid: false },
      'worship',
      1
    )
    expect(score.reasons).toContain('Divine Veil (Tinka)')
  })
})

describe('getLevel', () => {
  it('returns excellent for score >= 8', () => expect(getLevel(8)).toBe('excellent'))
  it('returns good for score 4-7', () => expect(getLevel(5)).toBe('good'))
  it('returns fair for score 1-3', () => expect(getLevel(2)).toBe('fair'))
})

describe('detectFormations', () => {
  it('detects Heavenly Flourish for 丁+乙', () => {
    const f = detectFormations('丁', '乙', '開門', '值符')
    expect(f).toContain('Heavenly Flourish (丁+乙)')
  })
  it('detects Green Dragon Returns for 戊+丙', () => {
    const f = detectFormations('戊', '丙', '開門', '值符')
    expect(f).toContain('Green Dragon Returns (戊+丙)')
  })
})
