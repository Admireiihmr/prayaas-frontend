import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

/**
 * Same three-theme structure as the ECG app, recoloured for Prayaas: cyan on
 * deep navy, taken from the logo, rather than the ECG app's blue.
 */
export const THEMES = {
  light: {
    key: 'light',
    pageBg: '#f2f7fa',
    sidebarBg: '#ffffff',
    sidebarBorder: '#e3e9ef',
    cardBg: '#ffffff',
    cardBorder: '#e3e9ef',
    cardShadow: '0 1px 3px rgba(12,42,74,0.07)',
    textPrimary: '#0c2a4a',
    textSecondary: '#44607c',
    textMuted: '#8ba0b4',
    inputBg: '#f8fafc',
    inputBorder: '#e3e9ef',
    inputText: '#0c2a4a',
    navActive: '#e0f6fb',
    navActiveTxt: '#0e7490',
    navHover: '#f1f5f9',
    navTxt: '#64798e',
    accent: '#0891b2',
    accentHover: '#0e7490',
    accentText: '#ffffff',
    divider: '#eef2f6',
    badgeBg: '#e0f6fb',
    badgeTxt: '#0e7490',
    badgeBorder: '#a5e8f5',
    statVal: '#0891b2',
    tableHdr: '#f8fafc',
    tableRow: '#ffffff',
    tableRowHov: '#f8fafc',
    tableDiv: '#eef2f6',
    modalBack: 'rgba(12,42,74,0.4)',
    headingLine: '#e3e9ef',
  },
  dark: {
    key: 'dark',
    pageBg: '#0a1628',
    sidebarBg: '#0a1628',
    sidebarBorder: '#16304f',
    cardBg: '#102844',
    cardBorder: '#1d3f63',
    cardShadow: '0 1px 3px rgba(0,0,0,0.3)',
    textPrimary: '#e8f4f8',
    textSecondary: '#b3c9db',
    textMuted: '#6b8299',
    inputBg: '#0a1628',
    inputBorder: '#1d3f63',
    inputText: '#e8f4f8',
    navActive: '#0e3a4a',
    navActiveTxt: '#67e8f9',
    navHover: '#102844',
    navTxt: '#8ba0b4',
    accent: '#22d3ee',
    accentHover: '#67e8f9',
    accentText: '#062330',
    divider: '#16304f',
    badgeBg: '#0e3a4a',
    badgeTxt: '#67e8f9',
    badgeBorder: '#155e75',
    statVal: '#22d3ee',
    tableHdr: '#102844',
    tableRow: '#102844',
    tableRowHov: '#16304f',
    tableDiv: '#1d3f63',
    modalBack: 'rgba(0,0,0,0.7)',
    headingLine: '#1d3f63',
  },
  neon: {
    key: 'neon',
    pageBg: '#04101f',
    sidebarBg: '#04101f',
    sidebarBorder: '#0a2540',
    cardBg: '#07182b',
    cardBorder: '#0a2540',
    cardShadow: '0 0 20px rgba(0,229,255,0.05)',
    textPrimary: '#e2f4fb',
    textSecondary: '#8fb3c9',
    textMuted: '#4a6680',
    inputBg: '#04101f',
    inputBorder: '#0a2540',
    inputText: '#e2f4fb',
    navActive: '#00232e',
    navActiveTxt: '#00e5ff',
    navHover: '#07182b',
    navTxt: '#4a6680',
    accent: '#00e5ff',
    accentHover: '#5cf0ff',
    accentText: '#04101f',
    divider: '#0a2540',
    badgeBg: '#00232e',
    badgeTxt: '#00e5ff',
    badgeBorder: '#00e5ff33',
    statVal: '#00e5ff',
    tableHdr: '#07182b',
    tableRow: '#07182b',
    tableRowHov: '#0a2540',
    tableDiv: '#0a2540',
    modalBack: 'rgba(0,0,0,0.85)',
    headingLine: '#0a2540',
  },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('prayaas-theme') || 'light'
    return THEMES[saved] || THEMES.light
  })

  const applyTheme = (key) => {
    const next = THEMES[key] || THEMES.light
    setTheme(next)
    localStorage.setItem('prayaas-theme', key)
  }

  useEffect(() => {
    let styleEl = document.getElementById('prayaas-theme-style')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'prayaas-theme-style'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = `
      body { background: ${theme.pageBg}; color: ${theme.textPrimary}; }
      :root {
        --page-bg: ${theme.pageBg};
        --sidebar-bg: ${theme.sidebarBg};
        --card-bg: ${theme.cardBg};
        --card-border: ${theme.cardBorder};
        --text-primary: ${theme.textPrimary};
        --text-muted: ${theme.textMuted};
        --accent: ${theme.accent};
        --input-bg: ${theme.inputBg};
        --input-border: ${theme.inputBorder};
        --divider: ${theme.divider};
      }
    `
  }, [theme])

  return <ThemeContext.Provider value={{ theme, applyTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
