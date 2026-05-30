import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useUserProfile } from './app/hooks/useUserProfile'
import { LoginPage } from './app/pages/LoginPage'
import { OnboardingPage } from './app/pages/OnboardingPage'
import { DashboardPage } from './app/pages/DashboardPage'
import { AuspiciousTimingPage } from './app/pages/AuspiciousTimingPage'
import { ProfilePage } from './app/pages/ProfilePage'
import { BottomNav } from './app/components/BottomNav'

export default function App() {
  const { profile, loading, setProfile } = useUserProfile()

  if (loading) return null

  if (!profile) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage onComplete={() => window.location.href = '/dashboard'} />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Box pb="70px">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage profile={profile} />} />
          <Route path="/timing" element={<AuspiciousTimingPage profile={profile} />} />
          <Route path="/profile" element={<ProfilePage profile={profile} onSignOut={() => setProfile(null)} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
      <BottomNav />
    </BrowserRouter>
  )
}
