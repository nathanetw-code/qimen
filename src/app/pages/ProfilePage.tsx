import { VStack, Heading, Box, Text, Badge, Button, Divider, HStack } from '@chakra-ui/react'
import { signOut } from '../lib/auth'
import { DEITY_INFO, GATE_INFO } from '../types'
import type { UserProfile } from '../types'

interface Props { profile: UserProfile; onSignOut: () => void }

export function ProfilePage({ profile, onSignOut }: Props) {
  const { threePalaces: tp } = profile

  async function handleSignOut() {
    await signOut()
    onSignOut()
  }

  return (
    <VStack spacing={6} p={6} align="stretch" maxW="md" mx="auto">
      <Heading size="md">โปรไฟล์ของฉัน</Heading>

      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text fontWeight="bold" mb={3}>ข้อมูล 3 วัง</Text>
        <HStack justify="space-between" mb={2}>
          <Text color="gray.500">วังโชคชะตา</Text>
          <Badge colorScheme="purple">วังที่ {tp.destinyPalaceNumber}</Badge>
        </HStack>
        <HStack justify="space-between" mb={2}>
          <Text color="gray.500">ทิศประจำตัว</Text>
          <Text fontWeight="semibold">{tp.destinyDirection}</Text>
        </HStack>
        <HStack justify="space-between" mb={2}>
          <Text color="gray.500">ธาตุประจำตัว</Text>
          <Text fontWeight="semibold">{tp.element}</Text>
        </HStack>
        <Divider my={3} />
        <Text fontWeight="bold" mb={2}>ประตูประจำตัว</Text>
        <Text>{GATE_INFO[tp.destinyDoor]?.nameThai ?? tp.destinyDoor}</Text>
        <Divider my={3} />
        <Text fontWeight="bold" mb={2}>เทพประจำตัว</Text>
        <Text>{DEITY_INFO[tp.destinyDeity]?.nameThai ?? tp.destinyDeity}</Text>
        <Text fontSize="sm" color="gray.500" mt={1}>
          {DEITY_INFO[tp.destinyDeity]?.power}
        </Text>
      </Box>

      <Box p={4} borderWidth={1} borderRadius="lg">
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold">ข้อมูลวันเกิด</Text>
          <Button
            size="xs"
            colorScheme="purple"
            variant="outline"
            onClick={() => window.location.href = '/onboarding'}
          >
            แก้ไข
          </Button>
        </HStack>
        <Text>วันเกิด: {profile.birthDate}</Text>
        <Text>เวลาเกิด: {profile.birthTime}</Text>
        <Text>กิ่งฟ้าวันเกิด: {tp.dayStem}</Text>
      </Box>

      <Button colorScheme="red" variant="outline" onClick={handleSignOut}>
        ออกจากระบบ
      </Button>
    </VStack>
  )
}
