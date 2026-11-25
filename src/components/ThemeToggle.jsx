import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
        dark
          ? 'border-white/15 bg-white/5 text-[#FFAA33] hover:border-[#FFAA33]/60 hover:bg-[#FFAA33]/10'
          : 'border-[#FFAA33]/40 bg-white/80 text-[#D97706] hover:bg-[#FFAA33] hover:text-white'
      }`}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}