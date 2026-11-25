import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'

export default function AdminLogin() {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${
        dark ? 'bg-[#08080c] text-white' : 'bg-[#FFF3D6] text-[#382719]'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl ${
          dark
            ? 'bg-white/[0.04] border-white/10'
            : 'bg-[#FFF9EC] border-[#FFAA33]/30'
        }`}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase opacity-60 hover:text-[#FFAA33] hover:opacity-100 transition mb-8"
        >
          <ArrowLeft size={14} /> Back to Website
        </Link>

        <h1 className="text-2xl font-black tracking-tight">
          THE BINDASS<span className="text-[#FFAA33]">.</span> ADMIN
        </h1>
        <p className={`text-sm mt-2 ${dark ? 'text-white/50' : 'text-[#795A38]'}`}>
          Sign in to manage your setup, recommendations, and site settings.
        </p>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs tracking-wider uppercase opacity-70 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thebindassbros.com"
                className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none focus:border-[#FFAA33] transition ${
                  dark
                    ? 'bg-white/[0.04] border-white/10 text-white'
                    : 'bg-white border-[#FFAA33]/30 text-[#382719]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase opacity-70 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none focus:border-[#FFAA33] transition ${
                  dark
                    ? 'bg-white/[0.04] border-white/10 text-white'
                    : 'bg-white border-[#FFAA33]/30 text-[#382719]'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#FFAA33] hover:bg-[#F09518] disabled:opacity-50 text-white font-semibold py-3.5 text-sm transition cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}