import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box, Text, VStack, Button } from '@chakra-ui/react'
import { Component, type ReactNode } from 'react'
import { useUserProfile } from './app/hooks/useUserProfile'
import { GuestPage } from './app/pages/GuestPage'
import { OnboardingPage } from './app/pages/OnboardingPage'
import { DashboardPage } from './app/pages/DashboardPage'
import { AuspiciousTimingPage } from './app/pages/AuspiciousTimingPage'
import { ProfilePage } from './app/pages/ProfilePage'
import { BottomNav } from './app/components/BottomNav'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error
      return (
        <VStack p={8} spacing={4} align="start">
          <Text fontWeight="bold" color="red.500">เกิดข้อผิดพลาด</Text>
          <Text fontSize="sm" fontFamily="mono">{err.message}</Text>
          <Button size="sm" onClick={() => window.location.href = '/'}>กลับหน้าแรก</Button>
        </VStack>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const { profile, user, loading, setProfile } = useUserProfile()

  if (loading) return null

  // Not logged in → guest home page (no login required)
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<GuestPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  // Logged in but no profile yet → onboarding
  if (!profile) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage redirectTo="/dashboard" />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  // Full app
  return (
    <BrowserRouter>
      <Box pb="70px">
        <ErrorBoundary>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage profile={profile} />} />
            <Route path="/timing" element={<AuspiciousTimingPage profile={profile} />} />
            <Route path="/profile" element={<ProfilePage profile={profile} onSignOut={() => setProfile(null)} />} />
            <Route path="/onboarding" element={<OnboardingPage initialProfile={profile} onSaved={setProfile} redirectTo="/profile" />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ErrorBoundary>
      </Box>
      <BottomNav />
    </BrowserRouter>
  )
}
