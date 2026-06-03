import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { loadUserProfile } from '../lib/auth'
import type { UserProfile } from '../types'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  )
  return Promise.race([promise, timeout])
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    withTimeout(supabase.auth.getSession(), 8000)
      .then(({ data }) => {
        const u = data.session?.user ?? null
        setUser(u)
        if (u) {
          withTimeout(loadUserProfile(u.id), 8000)
            .then(p => setProfile(p))
            .catch(() => setProfile(null))
            .finally(() => setLoading(false))
        } else {
          setLoading(false)
        }
      }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          try {
            const p = await withTimeout(loadUserProfile(u.id), 8000)
            setProfile(p)
          } catch {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { profile, user, loading, setProfile }
}
