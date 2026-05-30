import {
  VStack, Heading, Box, Text, Grid, GridItem,
  Badge, Divider, HStack, Spinner,
} from '@chakra-ui/react'
import { useCurrentChart } from '../hooks/useCurrentChart'
import { DEITY_INFO, GATE_INFO } from '../types'
import type { UserProfile } from '../types'

interface Props { profile: UserProfile }

export function DashboardPage({ profile: { threePalaces: tp } }: Props) {
  const { chart, currentHour } = useCurrentChart()

  const hourLabel = currentHour.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <VStack spacing={6} p={6} align="stretch" maxW="md" mx="auto">
      <HStack justify="space-between">
        <Heading size="md">แผนผัง Qimen</Heading>
        <Badge colorScheme="green">{hourLabel}</Badge>
      </HStack>

      {/* Current Qimen Chart */}
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text fontWeight="bold" mb={3}>ผัง Qimen ปัจจุบัน</Text>
        {chart ? (
          <QimenChartGrid chart={chart} highlightPalace={tp.destinyPalaceNumber} />
        ) : (
          <Spinner />
        )}
      </Box>

      {/* Natal Chart */}
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text fontWeight="bold" mb={3}>ผัง Destiny ของคุณ</Text>
        <Text fontSize="sm" color="gray.500">วังโชคชะตา: วังที่ {tp.destinyPalaceNumber}</Text>
      </Box>

      <Divider />

      {/* Direction + Deity */}
      <Grid templateColumns="1fr 1fr" gap={4}>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="lg" h="full">
            <Text fontWeight="bold" mb={2}>ทิศประจำตัว</Text>
            <Text fontSize="lg" color="purple.600">{tp.destinyDirection}</Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              หันหน้าทิศนี้ขณะไหว้เจ้า
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="lg" h="full">
            <Text fontWeight="bold" mb={2}>เทพประจำตัว</Text>
            <Text fontSize="sm" color="orange.600">
              {DEITY_INFO[tp.destinyDeity]?.nameThai ?? tp.destinyDeity}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              {DEITY_INFO[tp.destinyDeity]?.power}
            </Text>
          </Box>
        </GridItem>
      </Grid>

      {/* Destiny Door */}
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text fontWeight="bold" mb={2}>ประตูประจำตัว</Text>
        <HStack>
          <Text>{GATE_INFO[tp.destinyDoor]?.nameThai ?? tp.destinyDoor}</Text>
          {GATE_INFO[tp.destinyDoor]?.auspicious && (
            <Badge colorScheme="green">มงคล</Badge>
          )}
        </HStack>
      </Box>
    </VStack>
  )
}

// 3x3 grid showing 9 palaces — Luoshu arrangement
// Row 1: 4 9 2 | Row 2: 3 5 7 | Row 3: 8 1 6
function QimenChartGrid({ highlightPalace }: { chart: unknown; highlightPalace: number }) {
  const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6]
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={1}>
      {palaceOrder.map(p => (
        <GridItem
          key={p}
          p={2}
          borderWidth={1}
          borderRadius="md"
          bg={p === highlightPalace ? 'purple.50' : 'gray.50'}
          borderColor={p === highlightPalace ? 'purple.400' : 'gray.200'}
          textAlign="center"
          minH="60px"
        >
          <Text fontSize="xs" fontWeight="bold" color="gray.600">
            วัง {p}
          </Text>
          {p === highlightPalace && (
            <Badge colorScheme="purple" fontSize="9px">ชะตา</Badge>
          )}
        </GridItem>
      ))}
    </Grid>
  )
}
