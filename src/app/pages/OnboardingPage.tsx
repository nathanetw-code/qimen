import { useState, useEffect } from 'react'
import {
  VStack, Heading, FormControl, FormLabel,
  Select, Button, Text, HStack, useToast,
} from '@chakra-ui/react'
import { supabase } from '../lib/supabase'
import { saveUserProfile } from '../lib/auth'
import { buildThreePalaces, buildEngineChartFromDate } from '../palaces/threePalaceCalculator'
import type { Gender } from '../types'

interface Props { onComplete: () => void }

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

// Days 1-31
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

// CE years 1940-2010 (for users aged ~16-86)
const CE_START = 1940
const CE_END   = 2010
const YEARS_CE = Array.from({ length: CE_END - CE_START + 1 }, (_, i) => CE_END - i)

// Hours 0-23
const HOURS = Array.from({ length: 24 }, (_, i) => i)

// Minutes: every 15 min + 00/30 for common usage
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

export function OnboardingPage({ onComplete }: Props) {
  const [day,    setDay]    = useState('')
  const [month,  setMonth]  = useState('')
  const [yearCE, setYearCE] = useState('')
  const [hour,   setHour]   = useState('')
  const [minute, setMinute] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  // Derived: YYYY-MM-DD and HH:MM
  const birthDate = (day && month && yearCE)
    ? `${yearCE}-${String(Number(month)).padStart(2, '0')}-${String(Number(day)).padStart(2, '0')}`
    : ''
  const birthTime = (hour !== '' && minute !== '')
    ? `${String(Number(hour)).padStart(2, '0')}:${String(Number(minute)).padStart(2, '0')}`
    : ''

  // Validate days in month (e.g. Feb has max 28/29)
  const [maxDay, setMaxDay] = useState(31)
  useEffect(() => {
    if (month && yearCE) {
      const d = new Date(Number(yearCE), Number(month), 0).getDate()
      setMaxDay(d)
      if (Number(day) > d) setDay(String(d))
    }
  }, [month, yearCE])

  async function handleSave() {
    if (!birthDate || !birthTime) {
      toast({ title: 'กรุณาเลือกวันเกิดและเวลาเกิดให้ครบ', status: 'warning' })
      return
    }
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const birthDateTime = new Date(`${birthDate}T${birthTime}`)
      const natalChart    = buildEngineChartFromDate(birthDateTime)
      const threePalaces  = buildThreePalaces(birthDateTime, natalChart)
      await saveUserProfile(session.user.id, birthDate, birthTime, gender, threePalaces)
      onComplete()
    } catch (err) {
      console.error('Onboarding save error:', err)
      toast({ title: 'เกิดข้อผิดพลาด กรุณาลองใหม่', status: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <VStack minH="100vh" justify="center" spacing={6} p={8} maxW="sm" mx="auto">
      <Heading size="lg">ข้อมูลส่วนตัว</Heading>
      <Text color="gray.500" fontSize="sm" textAlign="center">
        ใส่วันเวลาเกิดเพื่อคำนวณดวงชะตาส่วนตัวของคุณ
      </Text>

      {/* ── วันเกิด ── */}
      <FormControl isRequired>
        <FormLabel>วันเกิด</FormLabel>
        <HStack spacing={2}>
          {/* Day */}
          <Select
            placeholder="วันที่"
            value={day}
            onChange={e => setDay(e.target.value)}
            flex={1}
          >
            {DAYS.filter(d => d <= maxDay).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>

          {/* Month */}
          <Select
            placeholder="เดือน"
            value={month}
            onChange={e => setMonth(e.target.value)}
            flex={2}
          >
            {THAI_MONTHS.map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </Select>
        </HStack>

        {/* Year (BE) */}
        <Select
          mt={2}
          placeholder="ปีเกิด (พ.ศ.)"
          value={yearCE}
          onChange={e => setYearCE(e.target.value)}
        >
          {YEARS_CE.map(ce => (
            <option key={ce} value={ce}>
              พ.ศ. {ce + 543}  ({ce})
            </option>
          ))}
        </Select>
      </FormControl>

      {/* ── เวลาเกิด ── */}
      <FormControl isRequired>
        <FormLabel>เวลาเกิด</FormLabel>
        <HStack spacing={2}>
          <Select
            placeholder="ชั่วโมง"
            value={hour}
            onChange={e => setHour(e.target.value)}
            flex={1}
          >
            {HOURS.map(h => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')} น.
              </option>
            ))}
          </Select>
          <Select
            placeholder="นาที"
            value={minute}
            onChange={e => setMinute(e.target.value)}
            flex={1}
          >
            {MINUTES.map(m => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            ))}
          </Select>
        </HStack>
        <Text fontSize="xs" color="gray.400" mt={1}>
          * ไม่ทราบเวลาเกิด ให้เลือก 12:00
        </Text>
      </FormControl>

      {/* ── เพศ ── */}
      <FormControl isRequired>
        <FormLabel>เพศ</FormLabel>
        <Select value={gender} onChange={e => setGender(e.target.value as Gender)}>
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
        </Select>
      </FormControl>

      {/* Preview */}
      {birthDate && birthTime && (
        <Text fontSize="xs" color="purple.600" bg="purple.50" px={3} py={2} borderRadius="md" w="full">
          📅 {day} {THAI_MONTHS[Number(month) - 1]} พ.ศ.{Number(yearCE) + 543} เวลา {birthTime} น.
        </Text>
      )}

      <Button
        w="full"
        colorScheme="blue"
        isLoading={saving}
        isDisabled={!birthDate || !birthTime}
        onClick={handleSave}
      >
        บันทึกและดูผล
      </Button>
    </VStack>
  )
}
