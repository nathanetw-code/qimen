import { HStack, Box, Text } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'แผนผัง', icon: '🔯' },
  { path: '/timing', label: 'หาฤกษ์', icon: '🗓️' },
  { path: '/profile', label: 'โปรไฟล์', icon: '👤' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      position="fixed" bottom={0} left={0} right={0}
      bg="white" borderTop="1px" borderColor="gray.200"
      pb="env(safe-area-inset-bottom)"
    >
      <HStack justify="space-around" py={2}>
        {NAV_ITEMS.map(item => (
          <Box
            key={item.path}
            textAlign="center"
            cursor="pointer"
            onClick={() => navigate(item.path)}
            color={location.pathname === item.path ? 'blue.500' : 'gray.500'}
            px={4} py={1}
          >
            <Text fontSize="xl">{item.icon}</Text>
            <Text fontSize="xs">{item.label}</Text>
          </Box>
        ))}
      </HStack>
    </Box>
  )
}
