import { ArrowRight, Eye, EyeOff, Lock, Mail, Microscope, Shield, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logoMark from '@/assets/logo-mark.png'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'
import { useResponsive } from '@/hooks/useResponsive'
import { api } from '@/services/apiClient'

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export default function LoginSignup() {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const { theme: T } = useTheme()
  const { t } = useLanguage()
  const { isMobile, isTablet } = useResponsive()

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const stacked = isMobile || isTablet

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!isLogin && !PASSWORD_RULE.test(password)) {
      setErrorMessage(t('auth_pw_hint'))
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage(t('auth_pw_mismatch'))
      return
    }

    setIsLoading(true)
    try {
      if (isLogin) {
        const data = await api.login(email, password)
        localStorage.setItem('token', data.token)
        setUser(data.user)
        navigate('/dashboard', { replace: true })
      } else {
        await api.signup(fullName, email, password)
        setIsLogin(true)
        setSuccessMessage(t('auth_created'))
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (toLogin) => {
    setIsLogin(toLogin)
    setErrorMessage('')
    setSuccessMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  const features = [
    { icon: Sparkles, text: t('auth_feat_1') },
    { icon: Shield, text: t('auth_feat_2') },
    { icon: Microscope, text: t('auth_feat_3') },
  ]

  const label = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  }

  const input = {
    width: '100%',
    padding: '12px 14px 12px 38px',
    border: `1px solid ${T.inputBorder}`,
    background: T.inputBg,
    color: T.inputText,
    borderRadius: 12,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
  }

  const iconStyle = { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.pageBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: T.cardBg,
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(12,42,74,0.18)',
          border: `1px solid ${T.cardBorder}`,
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          width: '100%',
          maxWidth: 980,
          overflow: 'hidden',
          minHeight: stacked ? 'auto' : 600,
        }}
      >
        {/* ── LEFT — brand panel ── */}
        <div
          style={{
            width: stacked ? '100%' : '42%',
            background: `linear-gradient(135deg, #0c2a4a, ${T.accent})`,
            padding: stacked ? '32px 28px' : 40,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ position: 'absolute', top: -64, right: -64, width: 256, height: 256, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 288, height: 288, borderRadius: '50%', background: 'rgba(0,0,0,0.12)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Black artwork on transparent: inverted to white for the navy panel. */}
            <img
              src="/cropped-cropped-IIHMR-Logo-03.png"
              alt="IIHMR Bangalore — Institute of Health Management Research"
              style={{ width: '100%', maxWidth: 210, height: 'auto', objectFit: 'contain', display: 'block', filter: 'invert(1) brightness(1.7)', marginBottom: stacked ? 20 : 30 }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: stacked ? 24 : 40 }}>
              <img src={logoMark} alt="" style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'contain' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                  {t('app_name')}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Powered by IIHMR.AI</div>
              </div>
            </div>

            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: stacked ? 19 : 23, lineHeight: 1.35, marginBottom: 10 }}>
              {t('auth_hero')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.65, maxWidth: 340 }}>
              {t('auth_hero_sub')}
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 14, marginTop: stacked ? 24 : 0 }}>
            {features.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#fff" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — form panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: stacked ? '32px 24px' : '48px 52px' }}>
          <div style={{ marginBottom: 26 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, margin: 0 }}>
              {isLogin ? t('auth_welcome') : t('auth_create')}
            </h1>
            <p style={{ fontSize: 13, color: T.textMuted, marginTop: 5 }}>
              {isLogin ? t('auth_welcome_sub') : t('auth_create_sub')}
            </p>
          </div>

          {errorMessage && (
            <div role="alert" style={{ marginBottom: 18, padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 12, fontSize: 12.5, lineHeight: 1.5 }}>
              ⚠ {errorMessage}
            </div>
          )}
          {successMessage && (
            <div role="status" style={{ marginBottom: 18, padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 12, fontSize: 12.5 }}>
              ✅ {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            {!isLogin && (
              <div>
                <label htmlFor="fullName" style={label}>{t('auth_full_name')}</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color={T.textMuted} style={iconStyle} />
                  <input id="fullName" style={input} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" required autoComplete="name" />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" style={label}>{t('auth_email')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color={T.textMuted} style={iconStyle} />
                <input id="email" type="email" style={input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required autoComplete="email" />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={label}>{t('auth_password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color={T.textMuted} style={iconStyle} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  style={{ ...input, paddingRight: 44 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {!isLogin && (
                <p style={{ fontSize: 10.5, color: T.textMuted, marginTop: 6 }}>{t('auth_pw_hint')}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" style={label}>{t('auth_confirm_password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color={T.textMuted} style={iconStyle} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    style={{ ...input, paddingRight: 44 }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, display: 'flex' }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px 0',
                borderRadius: 12,
                border: 'none',
                background: isLoading ? T.textMuted : T.accent,
                color: '#fff',
                fontWeight: 700,
                fontSize: 13.5,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s',
                marginTop: 4,
              }}
            >
              {isLoading ? t('auth_processing') : (
                <>{isLogin ? t('auth_signin') : t('auth_signup')} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 26, textAlign: 'center' }}>
            <div style={{ position: 'relative', marginBottom: 18 }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: `1px solid ${T.divider}` }} />
              </div>
              <span style={{ position: 'relative', background: T.cardBg, padding: '0 14px', fontSize: 11.5, color: T.textMuted }}>
                {isLogin ? t('auth_no_account') : t('auth_have_account')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => switchMode(!isLogin)}
              style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: `2px solid ${T.badgeBorder}`, background: 'transparent', color: T.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              {isLogin ? t('auth_create_free') : t('auth_signin_instead')}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: T.textMuted, marginTop: 22, lineHeight: 1.6 }}>
            {t('auth_terms')}{' '}
            <span style={{ color: T.accent }}>{t('auth_tos')}</span> {t('auth_and')}{' '}
            <span style={{ color: T.accent }}>{t('auth_privacy')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
