import { Button, VStack, Heading, Text, Box } from '@chakra-ui/react'
import { signInWithGoogle } from '../lib/auth'

export function LoginPage() {
  return (
    <VStack minH="100vh" justify="center" spacing={6} p={8}>
      <Heading size="xl">QimenAPP</Heading>
      <Text color="gray.500" textAlign="center">
        ค้นพบดวงชะตาและหาฤกษ์มงคลด้วยวิชาฉีเหมินตุ่นเจีย
      </Text>
      <Box w="full" maxW="sm">
        <Button
          w="full"
          colorScheme="blue"
          size="lg"
          onClick={() => signInWithGoogle()}
        >
          เข้าสู่ระบบด้วย Google
        </Button>
      </Box>
    </VStack>
  )
}
