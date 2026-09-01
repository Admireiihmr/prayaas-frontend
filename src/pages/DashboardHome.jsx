import { Activity, AlertTriangle, Clock, RefreshCw, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/context/UserContext'
import { useResponsive } from '@/hooks/useResponsive'
import { api } from '@/services/apiClient'

const NORMAL_CLASS = 1
const isConcerning = (row) => row.predicted_class !== NORMAL_CLASS

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardHome() {
  const { user } = useUser()
  const { theme: T } = useTheme()
  const { t } = useLanguage()
  const { isMobile, isTablet } = useResponsive()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const firstName = (user?.name || user?.full_name || '').trim().split(/\s+/)[0] || 'there'

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await api.screenings(10))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const card = { background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 18, boxShadow: T.cardShadow, minWidth: 0 }
  const pagePad = isMobile ? '20px 16px' : isTablet ? '24px 20px' : '32px 40px'

  const s = data?.stats
  const stats = [
    { key: 'total', label: t('dash_total'), sub: t('dash_total_sub'), value: s?.total ?? '—', icon: Activity },
    { key: 'flagged', label: t('dash_flagged'), sub: t('dash_flagged_sub'), value: s?.flagged ?? '—', icon: AlertTriangle },
    {
      key: 'conf',
      label: t('dash_confidence'),
      sub: t('dash_confidence_sub'),
      value: s?.avg_confidence != null ? `${(s.avg_confidence * 100).toFixed(1)}%` : '—',
      icon: TrendingUp,
    },
    {
      key: 'last',
      label: t('dash_last'),
      sub: t('dash_last_sub'),
      value: s?.last_at ? formatDate(s.last_at) : '—',
      icon: Clock,
      small: true,
    },
  ]

  const rows = data?.screenings ?? []

  const Badge = ({ row }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: isConcerning(row) ? '#fef2f2' : '#f0fdf4',
        color: isConcerning(row) ? '#b91c1c' : '#15803d',
        border: `1px solid ${isConcerning(row) ? '#fecaca' : '#bbf7d0'}`,
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
      {isConcerning(row) ? t('dash_referral') : t('dash_clear')}
    </span>
  )

  return (
    <div style={{ padding: pagePad, background: T.pageBg, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 16 : 28, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.textPrimary, margin: '0 0 4px' }}>
            {t('dash_welcome')}, {firstName} 👋
          </h1>
          <p style={{ fontSize: isMobile ? 12 : 13, color: T.textMuted, margin: 0 }}>{t('dash_summary')}</p>
        </div>
        <button
          onClick={load}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1px solid ${T.cardBorder}`, background: T.cardBg, color: T.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >
          <RefreshCw size={13} color={T.textMuted} /> {t('dash_refresh')}
        </button>
      </div>

      {error && (
        <div role="alert" style={{ marginBottom: 16, padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: 13, color: '#dc2626' }}>
          ⚠ {error}{' '}
          <button onClick={load} style={{ color: '#dc2626', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: isMobile ? 10 : 16, marginBottom: isMobile ? 16 : 24 }}>
        {stats.map(({ key, label, sub, value, icon: Icon, small }) => (
          <div key={key} style={{ ...card, padding: isMobile ? '14px 16px' : '20px 22px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${T.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon size={17} color={T.accent} />
            </div>
            {loading ? (
              <div style={{ height: 24, width: 54, background: T.cardBorder, borderRadius: 6, marginBottom: 4, animation: 'pulse 1.4s ease-in-out infinite' }} />
            ) : (
              <div style={{ fontSize: small ? (isMobile ? 13 : 15) : isMobile ? 18 : 22, fontWeight: 700, color: T.accent, wordBreak: 'break-word' }}>
                {value}
              </div>
            )}
            <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: T.textPrimary, marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div style={{ ...card, overflow: 'hidden', marginBottom: isMobile ? 16 : 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '14px 16px' : '18px 24px', borderBottom: `1px solid ${T.divider}`, gap: 10 }}>
          <h2 style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: T.textPrimary, margin: 0 }}>{t('dash_recent')}</h2>
          <Link to="/screening" style={{ fontSize: 12, color: T.accent, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {t('dash_new')}
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: isMobile ? '12px 16px' : '16px 24px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                {[80, 110, 60, 50].map((w, j) => (
                  <div key={j} style={{ height: 12, width: w, maxWidth: '25%', background: T.cardBorder, borderRadius: 6, animation: 'pulse 1.4s ease-in-out infinite' }} />
                ))}
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: '34px 16px', textAlign: 'center', color: T.textMuted, fontSize: 13 }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>🦷</div>
            {t('dash_none')}{' '}
            <Link to="/screening" style={{ color: T.accent, fontWeight: 700, textDecoration: 'none' }}>
              {t('dash_first')}
            </Link>
          </div>
        ) : isMobile ? (
          <div style={{ padding: '12px 14px', display: 'grid', gap: 10 }}>
            {rows.map((row) => (
              <div key={row.id} style={{ background: T.inputBg, borderRadius: 12, padding: '12px 14px', border: `1px solid ${T.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, minWidth: 0, overflowWrap: 'anywhere' }}>
                    {row.patient_name || '—'}
                  </div>
                  <Badge row={row} />
                </div>
                <div style={{ fontSize: 12, color: T.textSecondary, marginBottom: 4 }}>{row.label}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.textMuted }}>
                  <span>{formatDate(row.created_at)}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{(row.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr style={{ background: T.tableHdr }}>
                  {[t('dash_patient'), t('dash_date'), t('dash_result'), t('dash_conf'), ''].map((h, i) => (
                    <th key={i} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderTop: `1px solid ${T.tableDiv}`, background: T.tableRow }}>
                    <td style={{ padding: '13px 20px', fontSize: 12.5, fontWeight: 600, color: T.textPrimary }}>{row.patient_name || '—'}</td>
                    <td style={{ padding: '13px 20px', fontSize: 11.5, color: T.textMuted, whiteSpace: 'nowrap' }}>{formatDate(row.created_at)}</td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: T.textSecondary }}>{row.label}</td>
                    <td style={{ padding: '13px 20px', fontSize: 12, color: T.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{(row.confidence * 100).toFixed(1)}%</td>
                    <td style={{ padding: '13px 20px' }}><Badge row={row} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: `linear-gradient(135deg, #0c2a4a, ${T.accent})`, borderRadius: 18, padding: isMobile ? '18px 16px' : '24px 28px', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 16 }}>
        <div>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: isMobile ? 14 : 15, margin: '0 0 4px' }}>{t('dash_cta_title')}</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: 0 }}>{t('dash_cta_sub')}</p>
        </div>
        <Link to="/screening" style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
          <button style={{ background: '#fff', color: '#0c2a4a', fontWeight: 700, fontSize: 13, padding: '10px 22px', borderRadius: 12, border: 'none', cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
            {t('dash_cta_btn')}
          </button>
        </Link>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:.35}50%{opacity:.7}}`}</style>
    </div>
  )
}
