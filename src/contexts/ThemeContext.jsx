import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tbb-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  const dark = theme === 'dark'

  useEffect(() => {
    localStorage.setItem('tbb-theme', theme)
    document.documentElement.classList.toggle('dark', dark)
  }, [theme, dark])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ dark, theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}