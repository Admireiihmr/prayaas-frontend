import { Bell, Check, ChevronRight, Globe, Key, Monitor, Moon, Save, Shield, Sun, X, Zap } from 'lucide-react'
import { useState } from 'react'

import { LANGUAGES, useLanguage } from '@/context/LanguageContext'
import { THEMES, useTheme } from '@/context/ThemeContext'
import { useResponsive } from '@/hooks/useResponsive'

function Modal({ title, icon, T, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: T.modalBack, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }} onClick={onClose}>
      <div
        style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${T.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${T.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>{title}</span>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${T.cardBorder}`, background: T.cardBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} color={T.textMuted} />
          </button>
        </div>
        <div style={{ padding: '22px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

function ToggleRow({ label, sub, on, onToggle, T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${T.divider}` }}>
      <div style={{ flex: 1, marginRight: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{label}</div>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={on}
        aria-label={label}
        style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: on ? T.accent : T.cardBorder, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
      >
        <span style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
      </button>
    </div>
  )
}

function ModalFooter({ T, t, onClose, onSave, saved }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
      <button onClick={onClose} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: `1px solid ${T.cardBorder}`, background: T.cardBg, color: T.textSecondary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        {t('common_cancel')}
      </button>
      <button onClick={onSave} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: saved ? '#22c55e' : T.accent, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {saved ? (<><Check size={14} /> {t('settings_saved')}</>) : t('settings_save')}
      </button>
    </div>
  )
}

function TogglesModal({ T, t, title, icon, note, items: initial, onClose }) {
  const [state, setState] = useState(() => Object.fromEntries(initial.map((i) => [i.key, i.on])))
  const [saved, setSaved] = useState(false)

  return (
    <Modal title={title} icon={icon} T={T} onClose={onClose}>
      {note && (
        <div style={{ padding: '12px 16px', background: `${T.accent}0d`, border: `1px solid ${T.accent}22`, borderRadius: 12, marginBottom: 18, fontSize: 12, color: T.textSecondary, lineHeight: 1.6 }}>
          {note}
        </div>
      )}
      {initial.map((item) => (
        <ToggleRow
          key={item.key}
          label={item.label}
          sub={item.sub}
          on={state[item.key]}
          onToggle={() => setState((p) => ({ ...p, [item.key]: !p[item.key] }))}
          T={T}
        />
      ))}
      <ModalFooter T={T} t={t} onClose={onClose} saved={saved} onSave={() => { setSaved(true); setTimeout(() => { setSaved(false); onClose() }, 1100) }} />
    </Modal>
  )
}

function DevicesModal({ T, t, onClose }) {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Chrome on Windows', location: 'Bangalore, IN', lastSeen: 'Just now', current: true },
    { id: 2, name: 'Safari on iPhone', location: 'Bangalore, IN', lastSeen: '2 hours ago', current: false },
  ])

  return (
    <Modal title={t('set_devices')} icon={<Monitor size={16} color={T.accent} />} T={T} onClose={onClose}>
      <div style={{ display: 'grid', gap: 10 }}>
        {devices.map((d) => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: `1px solid ${d.current ? T.accent + '44' : T.cardBorder}`, background: d.current ? `${T.accent}0d` : T.cardBg, gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Monitor size={15} color={T.accent} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {d.name}
                  {d.current && <span style={{ fontSize: 10, fontWeight: 700, background: T.accent, color: T.accentText, padding: '1px 7px', borderRadius: 10 }}>Current</span>}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{d.location} · {d.lastSeen}</div>
              </div>
            </div>
            {!d.current && (
              <button onClick={() => setDevices((list) => list.filter((x) => x.id !== d.id))} style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 16, padding: '11px 0', borderRadius: 12, border: 'none', background: T.accent, color: T.accentText, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
        {t('common_done')}
      </button>
    </Modal>
  )
}

function ApiModal({ T, t, onClose }) {
  const endpoint = `${window.location.origin}/api/predict`
  const [copied, setCopied] = useState(false)

  return (
    <Modal title={t('set_api')} icon={<Key size={16} color={T.accent} />} T={T} onClose={onClose}>
      <p style={{ fontSize: 12, color: T.textMuted, marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
        The screening API accepts a multipart image upload and returns class probabilities.
      </p>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, fontWeight: 600 }}>Endpoint</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: `1px solid ${T.cardBorder}`, background: T.inputBg, fontSize: 12, fontFamily: 'monospace', color: T.textPrimary, wordBreak: 'break-all' }}>
          POST {endpoint}
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(endpoint).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
          style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: copied ? '#22c55e' : T.accent, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
      <div style={{ marginTop: 16, padding: '12px 16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
        ⚠ This endpoint is currently unauthenticated. Put it behind auth before exposing it publicly.
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 18, padding: '11px 0', borderRadius: 12, border: 'none', background: T.accent, color: T.accentText, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
        {t('common_close')}
      </button>
    </Modal>
  )
}

export default function Settings() {
  const { theme, applyTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const { isMobile, isTablet } = useResponsive()

  const [pendingLang, setPendingLang] = useState(language)
  const [saved, setSaved] = useState(false)
  const [modal, setModal] = useState(null)

  const T = theme
  const themeIcons = { light: Sun, dark: Moon, neon: Zap }
  const oneColumn = isMobile || isTablet

  const handleSave = () => {
    changeLanguage(pendingLang)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const pagePad = isMobile ? '20px 14px' : isTablet ? '24px 18px' : '32px 40px'
  const card = { background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: isMobile ? 18 : 24, boxShadow: T.cardShadow, marginBottom: isMobile ? 16 : 20 }

  const accountItems = [
    { key: 'notifications', label: t('set_notif'), sub: t('set_notif_sub'), icon: Bell },
    { key: 'privacy', label: t('set_privacy'), sub: t('set_privacy_sub'), icon: Shield },
    { key: 'devices', label: t('set_devices'), sub: t('set_devices_sub'), icon: Monitor },
    { key: 'api', label: t('set_api'), sub: t('set_api_sub'), icon: Key },
  ]

  return (
    <div style={{ minHeight: '100%', background: T.pageBg, padding: pagePad }}>
      <div style={{ marginBottom: isMobile ? 18 : 28 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.textPrimary, margin: '0 0 4px' }}>{t('settings_title')}</h1>
        <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{t('settings_sub')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: oneColumn ? '1fr' : '1fr 300px', gap: isMobile ? 0 : 20 }}>
        <div>
          {/* Appearance */}
          <div style={card}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, margin: '0 0 4px' }}>{t('settings_appear')}</h2>
            <p style={{ fontSize: 12, color: T.textMuted, margin: '0 0 16px' }}>{t('settings_appear_sub')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 10 : 14 }}>
              {Object.keys(THEMES).map((key) => {
                const th = THEMES[key]
                const Icon = themeIcons[key]
                const isActive = theme.key === key
                return (
                  <button
                    key={key}
                    onClick={() => applyTheme(key)}
                    style={{
                      position: 'relative',
                      borderRadius: 14,
                      padding: isMobile ? '12px 14px' : 16,
                      textAlign: 'left',
                      border: `2px solid ${isActive ? T.accent : T.cardBorder}`,
                      background: isActive ? `${T.accent}12` : T.cardBg,
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      display: 'flex',
                      alignItems: isMobile ? 'center' : 'flex-start',
                      flexDirection: isMobile ? 'row' : 'column',
                      gap: isMobile ? 12 : 0,
                    }}
                  >
                    {!isMobile && (
                      <div style={{ borderRadius: 10, padding: 12, marginBottom: 12, height: 72, display: 'flex', gap: 8, overflow: 'hidden', background: th.pageBg, border: `1px solid ${th.cardBorder}`, width: '100%' }}>
                        <div style={{ width: 22, borderRadius: 6, background: th.sidebarBg, border: `1px solid ${th.cardBorder}` }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                          <div style={{ height: 8, borderRadius: 4, background: th.accent, width: '65%' }} />
                          <div style={{ height: 6, borderRadius: 4, background: th.cardBorder, width: '85%' }} />
                          <div style={{ height: 6, borderRadius: 4, background: th.cardBorder, width: '50%' }} />
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} color={isActive ? T.accent : T.textMuted} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? T.accent : T.textPrimary }}>{t(`theme_${key}`)}</span>
                    </div>
                    {!isMobile && <p style={{ fontSize: 11, color: T.textMuted, margin: '3px 0 0' }}>{t(`theme_${key}_desc`)}</p>}
                    {isActive && (
                      <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={11} color={T.accentText} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Language */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Globe size={16} color={T.accent} />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, margin: 0 }}>{t('settings_lang')}</h2>
            </div>
            <p style={{ fontSize: 12, color: T.textMuted, margin: '0 0 16px' }}>{t('settings_lang_sub')}</p>
            <label htmlFor="lang" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {t('settings_language')}
            </label>
            <select
              id="lang"
              value={pendingLang}
              onChange={(e) => setPendingLang(e.target.value)}
              style={{ width: '100%', border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputText, padding: '11px 14px', borderRadius: 12, fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {pendingLang !== language && (
              <p style={{ fontSize: 11, color: T.accent, marginTop: 8, fontWeight: 500 }}>
                ⚡ {t('settings_lang_pending')} — {pendingLang} {t('settings_across')}
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 12, border: 'none', background: saved ? '#22c55e' : T.accent, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', justifyContent: 'center', marginBottom: isMobile ? 16 : 0 }}
          >
            {saved ? (<><Check size={14} /> {t('settings_saved')}</>) : (<><Save size={14} /> {t('settings_save')}</>)}
          </button>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: '0 0 14px' }}>{t('settings_cur_theme')}</h3>
            {(() => {
              const Icon = themeIcons[theme.key]
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: `${T.accent}14`, borderRadius: 12, border: `1px solid ${T.accent}33` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={T.accent} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{t(`theme_${theme.key}`)}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{t(`theme_${theme.key}_desc`)}</div>
                  </div>
                </div>
              )
            })()}
          </div>

          <div style={card}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, margin: '0 0 16px' }}>{t('settings_acct')}</h3>
            {accountItems.map((item, i) => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => setModal(item.key)}
                  style={{ display: 'flex', alignItems: 'center', width: '100%', textAlign: 'left', padding: '12px 0', gap: 12, background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < accountItems.length - 1 ? `1px solid ${T.divider}` : 'none', minHeight: 48 }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${T.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color={T.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <ChevronRight size={15} color={T.textMuted} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {modal === 'notifications' && (
        <TogglesModal
          T={T} t={t} title={t('set_notif')} icon={<Bell size={16} color={T.accent} />} onClose={() => setModal(null)}
          items={[
            { key: 'emailAlerts', label: 'Email Alerts', sub: 'Receive alerts via email for important events', on: true },
            { key: 'screenComplete', label: 'Screening Complete', sub: 'Notify when an image finishes screening', on: true },
            { key: 'weeklyReport', label: 'Weekly Report', sub: 'Receive a weekly summary of your screenings', on: false },
          ]}
        />
      )}
      {modal === 'privacy' && (
        <TogglesModal
          T={T} t={t} title={t('set_privacy')} icon={<Shield size={16} color={T.accent} />} onClose={() => setModal(null)}
          note="🔒 Uploaded images are processed in memory and are not stored after screening."
          items={[
            { key: 'dataCollection', label: 'Data Collection', sub: 'Allow collection of anonymized usage data', on: true },
            { key: 'analytics', label: 'Analytics', sub: 'Help us understand how the screening tool is used', on: false },
            { key: 'shareData', label: 'Share with Researchers', sub: 'Allow de-identified images for research', on: false },
          ]}
        />
      )}
      {modal === 'devices' && <DevicesModal T={T} t={t} onClose={() => setModal(null)} />}
      {modal === 'api' && <ApiModal T={T} t={t} onClose={() => setModal(null)} />}
    </div>
  )
}
