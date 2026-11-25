import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function ProtectedRoute() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080c] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFAA33] border-t-transparent" />
      </div>
    )
  }

  if (!isSupabaseConfigured || !session) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}