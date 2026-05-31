import { supabase } from './supabase'
import type { UserProfile, ThreePalaces } from '../types'

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return {
    id: data.id,
    birthDate: data.birth_date,
    birthTime: data.birth_time,
    gender: data.gender,
    threePalaces: {
      destinyPalaceNumber: data.destiny_palace_number,
      destinyDirection: data.destiny_direction,
      destinyDoor: data.destiny_door,
      destinyDeity: data.destiny_deity,
      dayStem: data.day_stem,
      element: data.element,
    },
    createdAt: data.created_at,
  }
}

export async function saveUserProfile(
  userId: string,
  birthDate: string,
  birthTime: string,
  gender: 'male' | 'female',
  threePalaces: ThreePalaces,
) {
  return supabase.from('user_profiles').upsert({
    id: userId,
    birth_date: birthDate,
    birth_time: birthTime,
    gender,
    day_stem: threePalaces.dayStem,
    destiny_palace_number: threePalaces.destinyPalaceNumber,
    destiny_direction: threePalaces.destinyDirection,
    destiny_door: threePalaces.destinyDoor,
    destiny_deity: threePalaces.destinyDeity,
    element: threePalaces.element,
  })
}
