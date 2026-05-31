// src/app/components/QimenChartGrid.tsx
// Full 9-palace Qimen chart display — shows all 4 layers (stem/star/gate/deity)

import { Box, Grid, GridItem, Text, VStack, HStack, Badge } from '@chakra-ui/react'
import type { EngineChart } from '../palaces/threePalaceCalculator'
import type { PalaceNumber, GateKey } from '../types'
import { PALACE_DIR_SHORT, PALACE_TRIGRAM, GATE_INFO } from '../types'

// Luoshu layout: Row1 = SE/S/SW, Row2 = E/C/W, Row3 = NE/N/NW
const PALACE_ORDER: PalaceNumber[] = [4, 9, 2, 3, 5, 7, 8, 1, 6]

// Palace background by element
const PALACE_BG: Record<PalaceNumber, string> = {
  1: 'blue.50',    // 坎 Water
  2: 'yellow.50',  // 坤 Earth
  3: 'green.50',   // 震 Wood
  4: 'green.50',   // 巽 Wood
  5: 'orange.50',  // 中 Earth
  6: 'gray.100',   // 乾 Metal
  7: 'gray.100',   // 兌 Metal
  8: 'yellow.50',  // 艮 Earth
  9: 'red.50',     // 離 Fire
}

// Direction header bar color (matching reference chart)
const DIR_HEADER_BG: Record<PalaceNumber, string> = {
  1: 'blue.500',    // N  水
  2: 'yellow.600',  // SW 土
  3: 'green.600',   // E  木
  4: 'teal.600',    // SE 木
  5: 'orange.500',  // 中 土
  6: 'gray.600',    // NW 金
  7: 'gray.400',    // W  金
  8: 'brown',       // NE 土 — fallback to yellow.700
  9: 'red.500',     // S  火
}
// Chakra doesn't have 'brown' — use yellow.800 for NE
const DIR_HEADER_FINAL: Record<PalaceNumber, string> = { ...DIR_HEADER_BG, 8: 'yellow.700' }

// Heaven stem colors by element
const STEM_COLOR: Record<string, string> = {
  '甲': 'green.700', '乙': 'green.600',
  '丙': 'red.500',   '丁': 'red.400',
  '戊': 'orange.600','己': 'orange.500',
  '庚': 'gray.700',  '辛': 'gray.600',
  '壬': 'blue.600',  '癸': 'blue.500',
}

// Nine-star colors (auspicious = teal/green, inauspicious = red/gray)
const STAR_COLOR: Record<string, string> = {
  '天心': 'yellow.600',  // most auspicious
  '天輔': 'teal.600',
  '天冲': 'green.600',
  '天任': 'green.500',
  '天禽': 'orange.500',
  '天英': 'orange.500',
  '天芮': 'red.500',
  '天柱': 'gray.600',
  '天蓬': 'blue.700',
}

// Deity display colors
const DEITY_COLOR: Record<string, string> = {
  '值符': 'yellow.600',
  '六合': 'green.600',
  '九天': 'teal.600',
  '太陰': 'blue.600',
  '九地': 'orange.600',
  '腾蛇': 'red.500',
  '白虎': 'gray.600',
  '玄武': 'blue.800',
}

interface Props {
  chart: EngineChart
  /** User's destiny palace number — highlighted with purple */
  highlightPalace?: PalaceNumber
}

export function QimenChartGrid({ chart, highlightPalace }: Props) {
  // Find where 值符 currently sits in this chart
  const deityPalaceIdx = chart.deities.findIndex(d => d === '值符')
  const deityPalaceNum = deityPalaceIdx !== -1
    ? (deityPalaceIdx + 1) as PalaceNumber
    : null

  return (
    <VStack spacing={2} w="full">
      {/* ── Chart metadata header ── */}
      <HStack spacing={2} flexWrap="wrap" justify="center">
        <Badge
          colorScheme={chart.dun === '陽遁' ? 'red' : 'blue'}
          variant="solid"
          fontSize="10px"
          px={2}
        >
          {chart.dun}
        </Badge>
        <Badge colorScheme="purple" variant="solid" fontSize="10px" px={2}>
          局 {chart.formation}
        </Badge>
        <Badge colorScheme="orange" variant="outline" fontSize="10px" px={2}>
          遁干 {chart.leadStem}
        </Badge>
      </HStack>

      {/* ── Direction compass labels ── */}
      <Box w="full" position="relative">
        <Text fontSize="9px" color="gray.400" textAlign="center" mb={0.5}>
          ⬆ N (เหนือ)
        </Text>

        {/* ── 3 × 3 palace grid ── */}
        <Grid templateColumns="repeat(3, 1fr)" gap="2px" w="full">
          {PALACE_ORDER.map((p) => {
            const idx = p - 1
            const isDestiny    = p === highlightPalace
            const isDeityPal   = p === deityPalaceNum

            const heavenStem = chart.heavenStems[idx] ?? ''
            const earthStem  = chart.earthStems[idx]  ?? ''
            const star       = chart.stars[idx]       ?? ''
            const gate       = chart.gates[idx]       ?? ''
            const deity      = chart.deities[idx]     ?? ''
            const isVoid     = chart.isVoid[idx]
            const isHorse    = chart.isHorse[idx]

            const gateAuspicious = GATE_INFO[gate as GateKey]?.auspicious ?? false

            return (
              <GridItem
                key={p}
                px={1}
                py={1.5}
                borderWidth={isDestiny ? 2 : 1}
                borderRadius="md"
                bg={isDestiny ? 'purple.100' : PALACE_BG[p]}
                borderColor={
                  isDestiny  ? 'purple.500' :
                  isDeityPal ? 'orange.400' :
                  'gray.200'
                }
                textAlign="center"
                minH="120px"
                position="relative"
              >
                {/* ── Direction header bar ── */}
                <Box
                  mx={-1}
                  mt={-1.5}
                  mb={1}
                  px={1}
                  py={0.5}
                  bg={isDestiny ? 'purple.500' : DIR_HEADER_FINAL[p]}
                  borderTopRadius="md"
                >
                  <HStack justify="space-between" px={0.5}>
                    <Text fontSize="7px" color="white" fontWeight="bold">
                      {PALACE_DIR_SHORT[p]}
                    </Text>
                    <Text fontSize="7px" color="whiteAlpha.800">
                      {PALACE_TRIGRAM[p]}{p}
                    </Text>
                  </HStack>
                </Box>

                {/* Heaven stem — large */}
                <Text
                  fontSize="22px"
                  fontWeight="bold"
                  lineHeight="1"
                  color={STEM_COLOR[heavenStem] ?? 'gray.700'}
                  mb={0.5}
                >
                  {heavenStem}
                </Text>

                {/* Earth stem — small below */}
                <Text
                  fontSize="9px"
                  color={STEM_COLOR[earthStem] ?? 'gray.500'}
                  mb={1}
                >
                  地 {earthStem}
                </Text>

                {/* Nine star */}
                <Text
                  fontSize="9px"
                  lineHeight="1.5"
                  color={STAR_COLOR[star] ?? 'teal.600'}
                  fontWeight={star === '天心' ? 'bold' : 'normal'}
                >
                  {star}
                </Text>

                {/* Gate — green if auspicious, red if not */}
                <Text
                  fontSize="9px"
                  lineHeight="1.5"
                  color={gateAuspicious ? 'green.600' : 'red.500'}
                  fontWeight={gateAuspicious ? 'bold' : 'normal'}
                >
                  {gate}
                </Text>

                {/* Deity */}
                <Text
                  fontSize="9px"
                  lineHeight="1.5"
                  color={DEITY_COLOR[deity] ?? 'orange.600'}
                >
                  {deity}
                </Text>

                {/* Status badges */}
                <HStack justify="center" spacing={0.5} mt={1} flexWrap="wrap">
                  {isVoid     && <Badge colorScheme="gray"   fontSize="6px" px={0.5}>空</Badge>}
                  {isHorse    && <Badge colorScheme="cyan"   fontSize="6px" px={0.5}>馬</Badge>}
                  {isDestiny  && <Badge colorScheme="purple" fontSize="6px" px={0.5}>命</Badge>}
                  {isDeityPal && <Badge colorScheme="orange" fontSize="6px" px={0.5}>符</Badge>}
                </HStack>
              </GridItem>
            )
          })}
        </Grid>
      </Box>

      {/* ── Legend ── */}
      <HStack spacing={3} flexWrap="wrap" justify="center" fontSize="9px" color="gray.500">
        <HStack spacing={0.5}>
          <Badge colorScheme="purple" fontSize="7px">命</Badge>
          <Text>วังชะตาของคุณ</Text>
        </HStack>
        <HStack spacing={0.5}>
          <Badge colorScheme="orange" fontSize="7px">符</Badge>
          <Text>ที่อยู่ 值符</Text>
        </HStack>
        <HStack spacing={0.5}>
          <Badge colorScheme="gray" fontSize="7px">空</Badge>
          <Text>Void</Text>
        </HStack>
        <HStack spacing={0.5}>
          <Badge colorScheme="cyan" fontSize="7px">馬</Badge>
          <Text>ม้าเดินทาง</Text>
        </HStack>
      </HStack>
    </VStack>
  )
}
