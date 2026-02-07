// src/lib/auth.js
import { supabase } from './supabase'

// Check if user is authenticated
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return user
}

// Check if user is admin
export async function isAdmin() {
  const user = await getUser()
  if (!user) return false

  // Check if user exists in admins table
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  return !!data
}

// Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}