import { useState } from 'react'
import {
  VStack, Heading, FormControl, FormLabel, Select,
  Input, Switch, Button, HStack, Box, Text,
  Badge, Divider, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
} from '@chakra-ui/react'
import { scoreHour, getLevel, getChineseHours } from '../scorer/auspiciousScorer'
import { ACTIVITY_LABEL } from '../types'
import type { ActivityType, AuspiciousHour, TimingSearchParams, UserProfile } from '../types'

interface Props { profile: UserProfile }

const LEVEL_COLOR: Record<AuspiciousHour['level'], string> = {
  excellent: 'green',
  good: 'blue',
  fair: 'yellow',
}

const LEVEL_LABEL: Record<AuspiciousHour['level'], string> = {
  excellent: 'ดีมาก',
  good: 'ดี',
  fair: 'พอได้',
}

export function AuspiciousTimingPage({ profile }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [params, setParams] = useState<TimingSearchParams>({
    activity: 'worship',
    fromDate: new Date(),
    toDate: new Date(),
    timeRange: 'all',
    avoidVoid: true,
    minLevel: 'good',
  })
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [results, setResults] = useState<AuspiciousHour[]>([])
  const [searched, setSearched] = useState(false)

  function handleSearch() {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    to.setDate(to.getDate() + 1)

    const found: AuspiciousHour[] = []
    const cursor = new Date(from)
    while (cursor < to) {
      const hours = getChineseHours(cursor)
      for (const h of hours) {
        if (params.timeRange !== 'all') {
          const hr = h.getHours()
          if (params.timeRange === 'morning' && (hr < 6 || hr >= 12)) continue
          if (params.timeRange === 'afternoon' && (hr < 12 || hr >= 18)) continue
          if (params.timeRange === 'evening' && (hr < 18 || hr >= 23)) continue
        }
        // Mock palace snapshot — replace with real engine lookup in Task 10
        const mockPalace = {
          gate: '開門' as const,
          deity: '九天' as const,
          star: '天心',
          heavenStem: '丁',
          earthStem: '乙',
          hasVoid: false,
        }
        const { total, reasons, warnings } = scoreHour(
          mockPalace,
          params.activity,
          profile.threePalaces.destinyPalaceNumber,
        )
        if (params.avoidVoid && warnings.length > 0) continue
        const level = getLevel(total)
        const levelOrder: Record<AuspiciousHour['level'], number> = { excellent: 3, good: 2, fair: 1 }
        if (levelOrder[level] < levelOrder[params.minLevel]) continue
        found.push({
          datetime: h,
          score: total,
          level,
          activity: params.activity,
          recommendedDirection: profile.threePalaces.destinyDirection,
          reasons,
          warnings,
        })
      }
      cursor.setDate(cursor.getDate() + 1)
    }
    found.sort((a, b) => b.score - a.score)
    setResults(found.slice(0, 30))
    setSearched(true)
  }

  return (
    <VStack spacing={6} p={6} align="stretch" maxW="md" mx="auto">
      <Heading size="md">หาฤกษ์</Heading>

      <Box p={4} borderWidth={1} borderRadius="lg">
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>กิจกรรม</FormLabel>
            <Select
              value={params.activity}
              onChange={e => setParams(p => ({ ...p, activity: e.target.value as ActivityType }))}
            >
              {(Object.entries(ACTIVITY_LABEL) as [ActivityType, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </FormControl>
          <HStack>
            <FormControl>
              <FormLabel>จาก</FormLabel>
              <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>ถึง</FormLabel>
              <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </FormControl>
          </HStack>
          <FormControl>
            <FormLabel>ช่วงเวลา</FormLabel>
            <Select
              value={params.timeRange}
              onChange={e => setParams(p => ({
                ...p,
                timeRange: e.target.value as TimingSearchParams['timeRange'],
              }))}
            >
              <option value="all">ทั้งวัน</option>
              <option value="morning">เช้า (06:00-12:00)</option>
              <option value="afternoon">บ่าย (12:00-18:00)</option>
              <option value="evening">เย็น (18:00-23:00)</option>
            </Select>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0}>หลีกเลี่ยงวัง Void</FormLabel>
            <Switch
              isChecked={params.avoidVoid}
              onChange={e => setParams(p => ({ ...p, avoidVoid: e.target.checked }))}
            />
          </FormControl>
          <FormControl>
            <FormLabel>ระดับขั้นต่ำ</FormLabel>
            <Select
              value={params.minLevel}
              onChange={e => setParams(p => ({
                ...p,
                minLevel: e.target.value as AuspiciousHour['level'],
              }))}
            >
              <option value="excellent">ดีมาก</option>
              <option value="good">ดี</option>
              <option value="fair">พอได้</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" onClick={handleSearch}>ค้นหาฤกษ์</Button>
        </VStack>
      </Box>

      {searched && (
        <Box>
          <Text mb={3} color="gray.500" fontSize="sm">
            พบ {results.length} ฤกษ์ (ทิศแนะนำ: {profile.threePalaces.destinyDirection})
          </Text>
          {results.length === 0 ? (
            <Text color="gray.400" textAlign="center">ไม่พบฤกษ์ที่ตรงเงื่อนไข</Text>
          ) : (
            <Accordion allowMultiple>
              {results.map((r, i) => (
                <AccordionItem key={i} mb={2} border="1px" borderColor="gray.200" borderRadius="md">
                  <AccordionButton>
                    <HStack flex={1} justify="space-between">
                      <Text fontWeight="semibold">
                        {r.datetime.toLocaleDateString('th-TH')}{' '}
                        {r.datetime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <HStack>
                        <Badge colorScheme={LEVEL_COLOR[r.level]}>{LEVEL_LABEL[r.level]}</Badge>
                        <Text fontSize="xs" color="gray.500">คะแนน {r.score}</Text>
                      </HStack>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Text fontSize="sm" mb={2}>
                      <strong>ทิศแนะนำ:</strong> {r.recommendedDirection}
                    </Text>
                    {r.reasons.length > 0 && (
                      <>
                        <Text fontSize="sm" fontWeight="bold">เหตุผล:</Text>
                        {r.reasons.map((reason, j) => (
                          <Text key={j} fontSize="sm" color="green.600">✓ {reason}</Text>
                        ))}
                      </>
                    )}
                    {r.warnings.length > 0 && (
                      <>
                        <Divider my={2} />
                        {r.warnings.map((w, j) => (
                          <Text key={j} fontSize="sm" color="orange.500">⚠ {w}</Text>
                        ))}
                      </>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>
      )}
    </VStack>
  )
}
