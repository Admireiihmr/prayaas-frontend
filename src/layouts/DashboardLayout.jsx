import { Info, LayoutGrid, LogOut, Menu, ScanLine, Settings as SettingsIcon, X as CloseIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import logoMark from '@/assets/logo-mark.png'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'
import { useResponsive } from '@/hooks/useResponsive'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const { theme: T } = useTheme()
  const { t } = useLanguage()
  const { isMobile, isTablet } = useResponsive()

  const [showLogout, setShowLogout] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const compact = isMobile || isTablet

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && compact ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen, compact])

  if (!user) return <Navigate to="/" replace />

  const name = user.name || user.full_name || ''
  const initials = name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'U'

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to
    return (
      <Link
        to={to}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          color: active ? T.navActiveTxt : T.navTxt,
          background: active ? T.navActive : 'transparent',
          textDecoration: 'none',
          transition: 'all 0.15s',
          minHeight: 44,
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = T.navHover
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = 'transparent'
        }}
      >
        <Icon size={17} color={active ? T.navActiveTxt : T.textMuted} /> {label}
      </Link>
    )
  }

  const TOPBAR = isMobile ? 64 : 68

  // The IIHMR mark is black artwork on a transparent background, so it
  // disappears against the dark and neon sidebars unless inverted to white.
  const iihmrFilter = T.key === 'light' ? 'none' : 'invert(1) brightness(1.7)'

  const sidebarInner = (
    <>
      <div>
        <div style={{ padding: '2px 6px 14px', borderBottom: `1px solid ${T.divider}`, marginBottom: 14 }}>
          <img
            src="/cropped-cropped-IIHMR-Logo-03.png"
            alt="IIHMR Bangalore — Institute of Health Management Research"
            style={{ width: '100%', maxWidth: 200, height: 'auto', objectFit: 'contain', display: 'block', filter: iihmrFilter }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 4px' }}>
          <img src={logoMark} alt="" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'contain', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.textPrimary }}>{t('app_name')}</div>
            <div style={{ fontSize: 10.5, color: T.textMuted }}>Powered by IIHMR.AI</div>
          </div>
        </div>

        {/* Signed-in user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, marginBottom: 16, background: T.navActive }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: T.accentText, fontWeight: 700, fontSize: 13 }}>{initials}</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: T.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
        </div>

        <Link to="/screening" style={{ display: 'block', marginBottom: 20 }}>
          <button style={{ width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', background: T.accent, color: T.accentText, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 2px 12px ${T.accent}44` }}>
            {t('nav_new_scan')}
          </button>
        </Link>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', padding: '0 16px', marginBottom: 6 }}>
            {t('nav_navigation')}
          </div>
          <NavItem to="/dashboard" icon={LayoutGrid} label={t('nav_dashboard')} />
          <NavItem to="/screening" icon={ScanLine} label={t('nav_screening')} />
        </div>
      </div>

      <div>
        <NavItem to="/settings" icon={SettingsIcon} label={t('nav_settings')} />
        <NavItem to="/about" icon={Info} label={t('nav_about')} />
        <div style={{ height: 1, background: T.divider, margin: '8px 0' }} />
        <button
          onClick={() => setShowLogout(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10, border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#ef4444', background: 'transparent', minHeight: 44 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={17} color="#ef4444" /> {t('nav_logout')}
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.pageBg, overflow: 'hidden', position: 'relative' }}>
      {compact && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}

      {compact && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: TOPBAR, background: T.sidebarBg, borderBottom: `1px solid ${T.divider}`, zIndex: 45, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14 }}>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle navigation"
            style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: T.cardBg, border: `1px solid ${T.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {sidebarOpen ? <CloseIcon size={20} color={T.textPrimary} /> : <Menu size={20} color={T.textPrimary} />}
          </button>
          <img src={logoMark} alt="" style={{ height: 36, width: 36, borderRadius: 9, objectFit: 'contain', flexShrink: 0 }} />
          <img
            src="/cropped-cropped-IIHMR-Logo-03.png"
            alt="IIHMR Bangalore"
            style={{ height: 22, width: 'auto', maxWidth: 'calc(100vw - 190px)', objectFit: 'contain', filter: iihmrFilter }}
          />
          <span style={{ fontWeight: 700, fontSize: 15, color: T.textPrimary, marginLeft: 'auto' }}>{t('app_name')}</span>
        </div>
      )}

      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: T.sidebarBg,
          borderRight: `1px solid ${T.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px 20px',
          justifyContent: 'space-between',
          overflowY: 'auto',
          ...(compact
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100%',
                zIndex: 50,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.25s ease',
                paddingTop: 20,
              }
            : { position: 'relative', height: '100vh' }),
        }}
      >
        {sidebarInner}
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', background: T.pageBg, minWidth: 0, paddingTop: compact ? TOPBAR : 0 }}>
        <Outlet />
      </main>

      {showLogout && (
        <div style={{ position: 'fixed', inset: 0, background: T.modalBack, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 28, width: '100%', maxWidth: 320 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <LogOut size={20} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, margin: '0 0 6px' }}>{t('logout_title')}</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: '0 0 22px' }}>{t('logout_msg')}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${T.cardBorder}`, background: T.cardBg, color: T.textSecondary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                {t('logout_cancel')}
              </button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {t('logout_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
