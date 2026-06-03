import {
  VStack, Heading, Box, Text,
  Badge, Divider, HStack, Spinner, Tabs, TabList,
  Tab, TabPanels, TabPanel, Grid, GridItem,
} from '@chakra-ui/react'
import { useCurrentChart } from '../hooks/useCurrentChart'
import { DEITY_INFO, GATE_INFO, STAR_INFO } from '../types'
import type { UserProfile, StarKey } from '../types'
import { QimenChartGrid } from '../components/QimenChartGrid'

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

interface Props { profile: UserProfile }

export function DashboardPage({ profile: { threePalaces: tp } }: Props) {
  const { chart, currentHour } = useCurrentChart()

  const hourLabel = currentHour.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit',
  })

  // Current info for user's destiny palace
  const destinyIdx = tp.destinyPalaceNumber - 1
  const currentGate   = chart?.gates[destinyIdx]   ?? null
  const currentDeity  = chart?.deities[destinyIdx] ?? null
  const currentStar   = chart?.stars[destinyIdx]   ?? null
  const currentIsVoid = chart?.isVoid[destinyIdx]  ?? false

  return (
    <VStack spacing={4} p={4} align="stretch" maxW="md" mx="auto">
      {/* ── Header: date + time + dun/formation ── */}
      <HStack justify="space-between" align="start">
        <VStack align="start" spacing={0}>
          <Heading size="md">แผนผัง Qimen</Heading>
          <Text fontSize="xs" color="gray.500">
            {currentHour.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </VStack>
        <VStack align="end" spacing={1}>
          <Badge colorScheme="green" fontSize="sm" px={2}>{hourLabel} น.</Badge>
          {chart && (
            <Badge colorScheme={chart.dun === '陽遁' ? 'red' : 'blue'} variant="solid" fontSize="10px">
              {chart.dun} {chart.formation} 局
            </Badge>
          )}
        </VStack>
      </HStack>

      {/* ── Bazi (八字) four pillars ── */}
      {chart && (
        <Box p={3} borderWidth={1} borderRadius="lg" bg="gray.50">
          <Text fontSize="10px" color="gray.400" mb={2} letterSpacing="wider">八字 BAZI</Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={1}>
            {([...chart.bazi].reverse() as string[]).map((pillar, i) => {
              const stem   = pillar[0] ?? ''
              const branch = pillar[1] ?? ''
              const label  = PILLAR_LABEL[3 - i]
              return (
                <VStack key={label} spacing={0} align="center"
                  p={2} borderRadius="md" bg="white" borderWidth={1} borderColor="gray.100">
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
      )}

      <Tabs variant="soft-rounded" colorScheme="purple" size="sm">
        <TabList>
          <Tab>ผัง 9 วัง</Tab>
          <Tab>3 วังของฉัน</Tab>
        </TabList>

        <TabPanels>
          {/* ── Tab 1: Full 9-palace chart ── */}
          <TabPanel px={0}>
            <Box p={3} borderWidth={1} borderRadius="lg">
              {chart ? (
                <QimenChartGrid
                  chart={chart}
                  highlightPalace={tp.destinyPalaceNumber}
                />
              ) : (
                <VStack py={8}><Spinner /><Text fontSize="sm" color="gray.400">กำลังโหลดผัง...</Text></VStack>
              )}
            </Box>
          </TabPanel>

          {/* ── Tab 2: User's three palaces ── */}
          <TabPanel px={0}>
            <VStack spacing={3} align="stretch">
              {/* Destiny palace summary */}
              <Box p={4} borderWidth={2} borderColor="purple.300" borderRadius="lg" bg="purple.50">
                <Text fontWeight="bold" mb={2} color="purple.700">
                  วังโชคชะตา — วังที่ {tp.destinyPalaceNumber}
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  <Badge colorScheme="purple">{tp.dayStem} (Day Stem)</Badge>
                  <Badge colorScheme="teal">{tp.element}</Badge>
                  <Badge colorScheme="blue">{tp.destinyDirection}</Badge>
                </HStack>

                {/* What's in destiny palace RIGHT NOW */}
                {chart && (
                  <>
                    <Divider my={3} />
                    <Text fontSize="xs" color="gray.500" mb={2}>ในวังนี้ตอนนี้:</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {currentGate && (
                        <Badge
                          colorScheme={GATE_INFO[currentGate as keyof typeof GATE_INFO]?.auspicious ? 'green' : 'red'}
                        >
                          {GATE_INFO[currentGate as keyof typeof GATE_INFO]?.nameThai ?? currentGate}
                        </Badge>
                      )}
                      {currentDeity && (
                        <Badge colorScheme="orange">
                          {DEITY_INFO[currentDeity as keyof typeof DEITY_INFO]?.nameThai ?? currentDeity}
                        </Badge>
                      )}
                      {currentStar && (
                        <Badge colorScheme={STAR_INFO[currentStar as StarKey]?.auspicious ? 'teal' : 'gray'}>
                          {STAR_INFO[currentStar as StarKey]?.nameThai ?? currentStar}
                        </Badge>
                      )}
                      {currentIsVoid && <Badge colorScheme="gray">⚠ Void</Badge>}
                    </HStack>
                  </>
                )}
              </Box>

              <Divider />

              {/* Direction & Deity cards */}
              <Grid templateColumns="1fr 1fr" gap={3}>
                <GridItem>
                  <Box p={4} borderWidth={1} borderRadius="lg" h="full">
                    <Text fontWeight="bold" mb={2} fontSize="sm">ทิศประจำตัว</Text>
                    <Text fontSize="lg" color="purple.600" fontWeight="bold">
                      {tp.destinyDirection.split(' ')[0]}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {tp.destinyDirection}
                    </Text>
                    <Text fontSize="xs" color="gray.400" mt={2}>
                      หันหน้าทิศนี้ขณะไหว้เจ้า
                    </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box p={4} borderWidth={1} borderRadius="lg" h="full">
                    <Text fontWeight="bold" mb={2} fontSize="sm">เทพประจำตัว</Text>
                    <Text fontSize="sm" color="orange.600" fontWeight="bold">
                      {DEITY_INFO[tp.destinyDeity]?.nameThai ?? tp.destinyDeity}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      {DEITY_INFO[tp.destinyDeity]?.power}
                    </Text>
                  </Box>
                </GridItem>
              </Grid>

              {/* Destiny Door */}
              <Box p={4} borderWidth={1} borderRadius="lg">
                <Text fontWeight="bold" mb={2} fontSize="sm">ประตูประจำตัว (Natal)</Text>
                <HStack>
                  <Text>{GATE_INFO[tp.destinyDoor]?.nameThai ?? tp.destinyDoor}</Text>
                  {GATE_INFO[tp.destinyDoor]?.auspicious && (
                    <Badge colorScheme="green">มงคล</Badge>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  ประตูในวังชะตาตอนเกิด
                </Text>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}
