import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { loadUserProfile } from '../lib/auth'
import type { UserProfile } from '../types'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  return { profile, loading, setProfile }
}
