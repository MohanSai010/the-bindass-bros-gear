import { useEffect, useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../contexts/ThemeContext'

export default function Settings() {
  const { dark } = useTheme()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const [settings, setSettings] = useState({
    site_name: 'THE BINDASS BROS',
    creator_bio: 'Welcome to The Bindass Bros. This is where we share our creative journey, favourite tools and the gear we believe in.',
    youtube_url: '',
    instagram_url: '',
    courses_url: '',
    contact_email: '',
  })

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const map = {}
          data.forEach((row) => {
            map[row.setting_key] = row.setting_value || ''
          })
          setSettings((prev) => ({ ...prev, ...map }))
        }
      })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    const rows = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: value,
    }))

    await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'setting_key' })

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#FFAA33] transition ${
    dark
      ? 'bg-white/[0.04] border-white/10 text-white'
      : 'bg-white border-[#FFAA33]/30 text-[#382719]'
  }`

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight mb-2">Website Settings</h1>
      <p className="text-sm opacity-60 mb-8">
        Update your channel details, courses link, and social media links.
      </p>

      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border bg-green-500/10 border-green-500/30 p-4 text-sm text-green-400">
          <CheckCircle size={18} /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Website Name
          </label>
          <input
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            About / Creator Bio
          </label>
          <textarea
            rows={4}
            value={settings.creator_bio}
            onChange={(e) => setSettings({ ...settings, creator_bio: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            YouTube Channel URL
          </label>
          <input
            type="url"
            value={settings.youtube_url}
            onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
            placeholder="https://youtube.com/@yourchannel"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Instagram URL
          </label>
          <input
            type="url"
            value={settings.instagram_url}
            onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
            placeholder="https://instagram.com/yourhandle"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Courses by Us URL
          </label>
          <input
            type="url"
            value={settings.courses_url}
            onChange={(e) => setSettings({ ...settings, courses_url: e.target.value })}
            placeholder="https://your-courses-link.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider opacity-70 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            placeholder="contact@thebindassbros.com"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#FFAA33] hover:bg-[#F09518] disabled:opacity-50 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition cursor-pointer"
        >
          <Save size={16} /> {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}