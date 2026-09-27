import { supabase } from './supabase.js'

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signUp(email, password, displayName) {
  return supabase.auth.signUp({
    email, password,
    options: { data: { display_name: displayName }, emailRedirectTo: window.location.origin }
  })
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}
