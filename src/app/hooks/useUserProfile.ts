import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { loadUserProfile } from '../lib/auth'
import type { UserProfile } from '../types'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fast initial load — clears loading immediately
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadUserProfile(data.session.user.id).then(p => {
          setProfile(p)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // Listen for OAuth callback / sign out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const p = await loadUserProfile(session.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { profile, loading, setProfile }
}
