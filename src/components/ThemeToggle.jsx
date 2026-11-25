import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, Monitor, Check } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function ThemeToggle() {
  const { mode, setMode, dark } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const ActiveIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-3 rounded-full border transition hover:scale-105 ${
          dark
            ? 'border-white/15 bg-white/[0.04] hover:border-[#FFAA33]/60'
            : 'border-[#FFAA33]/40 bg-[#FFF9EC] hover:border-[#FFAA33]'
        }`}
        aria-label="Select theme"
      >
        <ActiveIcon size={18} className="text-[#FFAA33]" />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-3 w-40 rounded-2xl border p-1.5 shadow-xl backdrop-blur-xl z-[120] ${
            dark
              ? 'bg-[#111116]/95 border-white/10 text-white'
              : 'bg-[#FFF9EC]/95 border-[#FFAA33]/30 text-[#382719]'
          }`}
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => {
            const active = mode === value
            return (
              <button
                key={value}
                onClick={() => {
                  setMode(value)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? 'bg-[#FFAA33]/15 text-[#FFAA33] font-semibold'
                    : dark
                      ? 'hover:bg-white/5 text-white/80'
                      : 'hover:bg-[#FFAA33]/10 text-[#382719]/80'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={15} />
                  {label}
                </span>
                {active && <Check size={14} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}