import { useState, useEffect } from 'react'
import {
  VStack, Heading, Box, Text, HStack, Button,
  FormControl, FormLabel, Select, Badge, Grid,
} from '@chakra-ui/react'
import { signInWithGoogle } from '../lib/auth'
import { buildThreePalaces, buildEngineChartFromDate } from '../palaces/threePalaceCalculator'
import type { EngineChart } from '../palaces/threePalaceCalculator'
import { QimenChartGrid } from '../components/QimenChartGrid'
import { GATE_INFO, DEITY_INFO } from '../types'
import type { Gender, ThreePalaces, GateKey, DeityKey } from '../types'

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
const DAYS    = Array.from({ length: 31 }, (_, i) => i + 1)
const CE_START = 1940
const CE_END   = 2010
const YEARS_CE = Array.from({ length: CE_END - CE_START + 1 }, (_, i) => CE_END - i)
const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

const STEM_COLOR: Record<string, string> = {
  '甲': 'green.700', '乙': 'green.600',
  '丙': 'red.500',   '丁': 'red.400',
  '戊': 'orange.600','己': 'orange.500',
  '庚': 'gray.700',  '辛': 'gray.600',
  '壬': 'blue.600',  '癸': 'blue.500',
}
const BRANCH_COLOR: Record<string, string> = {
  '子': 'blue.600',  '丑': 'orange.600',
  '寅': 'green.600', '卯': 'green.500',
  '辰': 'orange.600','巳': 'red.400',
  '午': 'red.500',   '未': 'orange.500',
  '申': 'gray.600',  '酉': 'gray.500',
  '戌': 'orange.700','亥': 'blue.500',
}
const PILLAR_LABEL = ['年', '月', '日', '時'] as const

export function GuestPage() {
  const [day,    setDay]    = useState('')
  const [month,  setMonth]  = useState('')
  const [yearCE, setYearCE] = useState('')
  const [hour,   setHour]   = useState('')
  const [minute, setMinute] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [maxDay, setMaxDay] = useState(31)
  const [result,     setResult]     = useState<ThreePalaces | null>(null)
  const [natalChart, setNatalChart] = useState<EngineChart | null>(null)

  const birthDate = (day && month && yearCE)
    ? `${yearCE}-${String(Number(month)).padStart(2, '0')}-${String(Number(day)).padStart(2, '0')}`
    : ''
  const birthTime = (hour !== '' && minute !== '')
    ? `${String(Number(hour)).padStart(2, '0')}:${String(Number(minute)).padStart(2, '0')}`
    : ''

  useEffect(() => {
    if (month && yearCE) {
      const d = new Date(Number(yearCE), Number(month), 0).getDate()
      setMaxDay(d)
      if (Number(day) > d) setDay(String(d))
    }
  }, [month, yearCE, day])

  function handleCompute() {
    if (!birthDate || !birthTime) return
    const birthDateTime = new Date(`${birthDate}T${birthTime}`)
    const chart         = buildEngineChartFromDate(birthDateTime)
    const threePalaces  = buildThreePalaces(birthDateTime, chart)
    setNatalChart(chart)
    setResult(threePalaces)
  }

  return (
    <VStack spacing={0} align="stretch" minH="100vh" bg="gray.50">
      {/* Header */}
      <HStack
        px={4} py={3} bg="white" borderBottom="1px" borderColor="gray.100"
        justify="space-between"
      >
        <HStack spacing={2}>
          <Text fontSize="xl">🔯</Text>
          <Heading size="sm">QimenAPP</Heading>
        </HStack>
        <Button size="sm" colorScheme="blue" onClick={() => signInWithGoogle()}>
          เข้าสู่ระบบ
        </Button>
      </HStack>

      <VStack spacing={4} p={4} align="stretch" maxW="md" mx="auto" w="full">
        {/* Form card */}
        <Box p={4} bg="white" borderRadius="xl" shadow="sm" borderWidth={1} borderColor="gray.100">
          <Text fontWeight="bold" mb={1}>ค้นพบดวงชะตาของคุณ</Text>
          <Text fontSize="xs" color="gray.500" mb={4}>
            ใส่วันเวลาเกิด — เห็นผลทันที ไม่ต้องสมัครสมาชิก
          </Text>

          <FormControl mb={3}>
            <FormLabel fontSize="sm">วันเกิด</FormLabel>
            <HStack spacing={2}>
              <Select placeholder="วันที่" value={day}
                onChange={e => setDay(e.target.value)} flex={1} size="sm">
                {DAYS.filter(d => d <= maxDay).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
              <Select placeholder="เดือน" value={month}
                onChange={e => setMonth(e.target.value)} flex={2} size="sm">
                {THAI_MONTHS.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </Select>
            </HStack>
            <Select mt={2} placeholder="ปีเกิด (พ.ศ.)" value={yearCE}
              onChange={e => setYearCE(e.target.value)} size="sm">
              {YEARS_CE.map(ce => (
                <option key={ce} value={ce}>พ.ศ. {ce + 543} ({ce})</option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel fontSize="sm">เวลาเกิด</FormLabel>
            <HStack spacing={2}>
              <Select placeholder="ชั่วโมง" value={hour}
                onChange={e => setHour(e.target.value)} flex={1} size="sm">
                {HOURS.map(h => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')} น.</option>
                ))}
              </Select>
              <Select placeholder="นาที" value={minute}
                onChange={e => setMinute(e.target.value)} flex={1} size="sm">
                {MINUTES.map(m => (
                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                ))}
              </Select>
            </HStack>
            <Text fontSize="10px" color="gray.400" mt={1}>
              * ไม่ทราบเวลาเกิด ให้เลือก 12:00
            </Text>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontSize="sm">เพศ</FormLabel>
            <Select value={gender} onChange={e => setGender(e.target.value as Gender)} size="sm">
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
            </Select>
          </FormControl>

          <Button
            w="full" colorScheme="purple"
            isDisabled={!birthDate || !birthTime}
            onClick={handleCompute}
          >
            คำนวณดวง →
          </Button>
        </Box>

        {/* Results — shown after compute */}
        {result && natalChart && (
          <>
            {/* 八字 BAZI */}
            <Box p={3} bg="white" borderRadius="xl" shadow="sm"
              borderWidth={1} borderColor="gray.100">
              <Text fontSize="10px" color="gray.400" letterSpacing="wider" mb={2}>
                八字 BAZI
              </Text>
              <Grid templateColumns="repeat(4, 1fr)" gap={1}>
                {([...natalChart.bazi].reverse() as string[]).map((pillar, i) => {
                  const stem   = pillar[0] ?? ''
                  const branch = pillar[1] ?? ''
                  const label  = PILLAR_LABEL[3 - i]
                  return (
                    <VStack key={label} spacing={0} align="center"
                      p={2} borderRadius="md" bg="gray.50"
                      borderWidth={1} borderColor="gray.100">
                      <Text fontSize="9px" color="gray.400" fontWeight="bold">{label}</Text>
                      <Text fontSize="22px" fontWeight="bold" lineHeight="1.2"
                        color={STEM_COLOR[stem] ?? 'gray.700'}>{stem}</Text>
                      <Text fontSize="16px" lineHeight="1.2"
                        color={BRANCH_COLOR[branch] ?? 'gray.600'}>{branch}</Text>
                    </VStack>
                  )
                })}
              </Grid>
            </Box>

            {/* Natal 9-palace chart */}
            <Box p={3} bg="white" borderRadius="xl" shadow="sm"
              borderWidth={1} borderColor="gray.100">
              <Text fontSize="10px" color="gray.400" letterSpacing="wider" mb={2}>
                ผัง 9 วัง ณ วันเกิด — {natalChart.dun} {natalChart.formation} 局
              </Text>
              <QimenChartGrid
                chart={natalChart}
                highlightPalace={result.destinyPalaceNumber}
              />
            </Box>

            {/* 3 Palaces summary */}
            <Box p={4} bg="purple.50" borderRadius="xl"
              borderWidth={2} borderColor="purple.200">
              <Text fontWeight="bold" color="purple.700" mb={3}>
                วังชะตา — วังที่ {result.destinyPalaceNumber} ({result.destinyDirection})
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                <Badge colorScheme="purple">{result.dayStem} {result.element}</Badge>
                <Badge colorScheme={GATE_INFO[result.destinyDoor as GateKey]?.auspicious ? 'green' : 'red'}>
                  {GATE_INFO[result.destinyDoor as GateKey]?.nameThai ?? result.destinyDoor}
                </Badge>
                <Badge colorScheme="orange">
                  {DEITY_INFO[result.destinyDeity as DeityKey]?.nameThai ?? result.destinyDeity}
                </Badge>
              </HStack>
              {DEITY_INFO[result.destinyDeity as DeityKey]?.power && (
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {DEITY_INFO[result.destinyDeity as DeityKey].power}
                </Text>
              )}
            </Box>

            {/* Login CTA */}
            <Box p={5} bg="purple.600" borderRadius="xl" color="white" textAlign="center" mb={4}>
              <Text fontWeight="bold" mb={1}>🔒 ต้องการบันทึกและหาฤกษ์?</Text>
              <Text fontSize="sm" opacity={0.85} mb={4}>
                เข้าสู่ระบบเพื่อบันทึกดวงของคุณ
                และค้นหาฤกษ์มงคลส่วนตัว
              </Text>
              <Button
                bg="white" color="purple.700" _hover={{ bg: 'purple.50' }}
                onClick={() => signInWithGoogle()}
              >
                เข้าสู่ระบบด้วย Google
              </Button>
            </Box>
          </>
        )}
      </VStack>
    </VStack>
  )
}
