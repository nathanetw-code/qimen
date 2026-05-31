import {
  VStack, Heading, Box, Text,
  Badge, Divider, HStack, Spinner, Tabs, TabList,
  Tab, TabPanels, TabPanel, Grid, GridItem,
} from '@chakra-ui/react'
import { useCurrentChart } from '../hooks/useCurrentChart'
import { DEITY_INFO, GATE_INFO, STAR_INFO } from '../types'
import type { UserProfile, StarKey } from '../types'
import { QimenChartGrid } from '../components/QimenChartGrid'

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
      <HStack justify="space-between">
        <Heading size="md">แผนผัง Qimen</Heading>
        <Badge colorScheme="green">{hourLabel}</Badge>
      </HStack>

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
