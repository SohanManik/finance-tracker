import { createContext, useContext, useState, useEffect } from 'react'
import { themes, defaultTheme } from './themes'

const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('finance_theme') || defaultTheme
  })

  const theme = themes[themeName]

  function changeTheme(name) {
    setThemeName(name)
    localStorage.setItem('finance_theme', name)
  }

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}