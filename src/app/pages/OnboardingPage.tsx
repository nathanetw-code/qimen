import { useState } from 'react'
import {
  VStack, Heading, FormControl, FormLabel,
  Input, Select, Button, Text, useToast,
} from '@chakra-ui/react'
import { supabase } from '../lib/supabase'
import { saveUserProfile } from '../lib/auth'
import { buildThreePalaces, buildEngineChartFromDate } from '../palaces/threePalaceCalculator'
import type { Gender } from '../types'

interface Props { onComplete: () => void }

export function OnboardingPage({ onComplete }: Props) {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  async function handleSave() {
    if (!birthDate || !birthTime) {
      toast({ title: 'กรุณากรอกวันเกิดและเวลาเกิด', status: 'warning' })
      return
    }
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const birthDateTime = new Date(`${birthDate}T${birthTime}`)
      const natalChart = buildEngineChartFromDate(birthDateTime)
      const threePalaces = buildThreePalaces(birthDateTime, natalChart)
      await saveUserProfile(session.user.id, birthDate, birthTime, gender, threePalaces)
      onComplete()
    } catch {
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
      <FormControl isRequired>
        <FormLabel>วันเกิด</FormLabel>
        <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>เวลาเกิด</FormLabel>
        <Input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>เพศ</FormLabel>
        <Select value={gender} onChange={e => setGender(e.target.value as Gender)}>
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
        </Select>
      </FormControl>
      <Button w="full" colorScheme="blue" isLoading={saving} onClick={handleSave}>
        บันทึกและดูผล
      </Button>
    </VStack>
  )
}
