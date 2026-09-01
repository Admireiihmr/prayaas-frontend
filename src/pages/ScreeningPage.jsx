import jsPDF from 'jspdf'
import { Download, ImageUp, RotateCcw, ScanLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useResponsive } from '@/hooks/useResponsive'
import { api } from '@/services/apiClient'

const ACCEPTED = ['image/jpeg', 'image/png']
const EMPTY_PATIENT = { name: '', gender: '', age: '', abha: '' }

/** Anything but "No Abnormality detected" warrants a referral. */
const isConcerning = (label) => label !== 'No Abnormality detected'

const RED = [239, 68, 68]
const RED_BG = [254, 242, 242]
const RED_TEXT = [185, 28, 28]
const GREEN = [34, 197, 94]
const GREEN_BG = [240, 253, 244]
const GREEN_TEXT = [21, 128, 61]

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Renders the screening result straight into a PDF (jsPDF), so "download" hands
 * back an actual .pdf — no print dialog, no intermediate HTML file. */
async function buildReportPdf({ result, submitted }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 16
  let y = 20

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(15, 23, 42)
  doc.text('Oral Cancer Screening Report', margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100)
  const patientLine = submitted?.name
    ? `${submitted.name} · ${submitted.gender} · ${submitted.age}${submitted.abha ? ` · ABHA ${submitted.abha}` : ''}`
    : 'Anonymous screening'
  doc.text(patientLine, margin, y)
  y += 6
  doc.text(`Generated ${new Date().toLocaleString()}`, margin, y)
  y += 10

  const concerning = isConcerning(result.label)
  const [br, bg, tx] = concerning ? [RED, RED_BG, RED_TEXT] : [GREEN, GREEN_BG, GREEN_TEXT]
  doc.setFillColor(...bg)
  doc.setDrawColor(...br)
  doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...tx)
  doc.text(result.label, margin + 4, y + 9)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`${(result.confidence * 100).toFixed(1)}%`, pageWidth - margin - 4, y + 9, { align: 'right' })
  y += 14 + 10

  const heroImage = result.processing_steps?.find((s) => s.label === 'Original')?.image
  if (heroImage) {
    try {
      const img = await loadImage(heroImage)
      const maxW = 80
      const maxH = 60
      const ratio = Math.min(maxW / img.width, maxH / img.height)
      const w = img.width * ratio
      const h = img.height * ratio
      doc.addImage(heroImage, 'PNG', (pageWidth - w) / 2, y, w, h, undefined, 'FAST')
      y += maxH + 10
    } catch {
      // Image failed to decode — skip it rather than fail the whole report.
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('Class probabilities', margin, y)
  y += 8

  const barWidth = pageWidth - margin * 2
  Object.entries(result.probabilities)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, value]) => {
      const [barColor, textColor] = isConcerning(name) ? [RED, RED_TEXT] : [GREEN, GREEN_TEXT]
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...textColor)
      doc.text(name, margin, y)
      doc.setTextColor(80)
      doc.text(`${value.toFixed(1)}%`, pageWidth - margin, y, { align: 'right' })
      const barY = y + 2
      doc.setFillColor(226, 232, 240)
      doc.rect(margin, barY, barWidth, 2, 'F')
      doc.setFillColor(...barColor)
      doc.rect(margin, barY, barWidth * (value / 100), 2, 'F')
      y += 10
    })
  y += 4

  if (result.processing_steps?.length) {
    if (y > 200) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(15, 23, 42)
    doc.text('Processing breakdown', margin, y)
    y += 8

    // Wraps into rows of `cols` images, breaking to a new page between rows
    // rather than mid-image — the step count varies (Grad-CAM steps may be
    // skipped if the heatmap fails), so this can't assume a fixed layout.
    const cols = 3
    const gap = 6
    const cell = (pageWidth - margin * 2 - gap * (cols - 1)) / cols
    let rowY = y

    for (let i = 0; i < result.processing_steps.length; i++) {
      const col = i % cols
      if (col === 0) {
        if (i > 0) y = rowY + cell + 14
        if (y + cell + 14 > 280) {
          doc.addPage()
          y = 20
        }
        rowY = y
      }

      const step = result.processing_steps[i]
      const x = margin + col * (cell + gap)
      try {
        const img = await loadImage(step.image)
        const ratio = Math.min(cell / img.width, cell / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        doc.addImage(step.image, 'PNG', x + (cell - w) / 2, rowY + (cell - h) / 2, w, h, undefined, 'FAST')
      } catch {
        // Skip a step image that fails to decode rather than aborting the report.
      }

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100)
      doc.text(doc.splitTextToSize(step.label, cell), x + cell / 2, rowY + cell + 5, { align: 'center' })
    }
    y = rowY + cell + 14
  }

  if (y > 275) {
    doc.addPage()
    y = 20
  }
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text('Screening aid only — not a diagnosis. Confirm findings with a clinician.', margin, Math.max(y, 285))

  return doc
}

export default function ScreeningPage() {
  const { theme: T } = useTheme()
  const { t } = useLanguage()
  const { isMobile, isTablet } = useResponsive()

  const [patient, setPatient] = useState(EMPTY_PATIENT)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [submitted, setSubmitted] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [reportBusy, setReportBusy] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    // Without this the blob URL leaks on every new selection.
    return () => URL.revokeObjectURL(url)
  }, [file])

  const oneCol = isMobile || isTablet
  const pagePad = isMobile ? '20px 14px' : isTablet ? '24px 18px' : '32px 40px'
  const card = { background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: isMobile ? 18 : 24, boxShadow: T.cardShadow, marginBottom: 20 }

  const label = { display: 'block', fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }
  const field = { width: '100%', padding: '11px 13px', border: `1px solid ${T.inputBorder}`, background: T.inputBg, color: T.inputText, borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'inherit' }

  const set = (k) => (e) => setPatient((p) => ({ ...p, [k]: e.target.value }))

  const handleFiles = (files) => {
    const chosen = files?.[0]
    if (chosen && ACCEPTED.includes(chosen.type)) {
      setFile(chosen)
      setErrors((e) => ({ ...e, file: undefined }))
    }
  }

  const validate = () => {
    const found = {}
    if (!patient.name.trim()) found.name = t('screen_err_name')
    if (!patient.gender) found.gender = t('screen_err_gender')
    if (!patient.age || Number(patient.age) <= 0) found.age = t('screen_err_age')
    if (!file) found.file = t('screen_err_image')
    return found
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError(null)

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    setLoading(true)
    try {
      setResult(await api.predict(file, patient))
      setSubmitted(patient)
    } catch (err) {
      setApiError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setPatient(EMPTY_PATIENT)
    setFile(null)
    setErrors({})
    setResult(null)
    setSubmitted(null)
    setApiError(null)
  }

  async function handleDownloadReport() {
    if (!result || reportBusy) return
    setReportBusy(true)
    try {
      const doc = await buildReportPdf({ result, submitted })
      const namePart = submitted?.name ? submitted.name.trim().replace(/\s+/g, '_') : 'screening'
      doc.save(`${namePart}-report-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setReportBusy(false)
    }
  }

  const fields = [
    { key: 'name', label: t('screen_name'), required: true },
    { key: 'gender', label: t('screen_gender'), required: true, select: true },
    { key: 'age', label: t('screen_age'), required: true, type: 'number' },
    { key: 'abha', label: t('screen_abha'), placeholder: t('screen_optional') },
  ]

  return (
    <div style={{ minHeight: '100%', background: T.pageBg, padding: pagePad }}>
      <div style={{ marginBottom: isMobile ? 18 : 26 }}>
        <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.textPrimary, margin: '0 0 4px' }}>{t('screen_title')}</h1>
        <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{t('screen_sub')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Patient */}
        <div style={card}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, margin: '0 0 16px' }}>{t('screen_patient')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} style={label}>
                  {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {f.select ? (
                  <select id={f.key} value={patient.gender} onChange={set('gender')} style={{ ...field, cursor: 'pointer' }}>
                    <option value="">{t('screen_select')}</option>
                    <option value="Male">{t('screen_male')}</option>
                    <option value="Female">{t('screen_female')}</option>
                    <option value="Other">{t('screen_other')}</option>
                  </select>
                ) : (
                  <input
                    id={f.key}
                    type={f.type || 'text'}
                    min={f.type === 'number' ? 1 : undefined}
                    max={f.type === 'number' ? 120 : undefined}
                    value={patient[f.key]}
                    onChange={set(f.key)}
                    placeholder={f.placeholder}
                    style={field}
                    autoComplete="off"
                  />
                )}
                {errors[f.key] && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#ef4444' }}>{errors[f.key]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div style={card}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, margin: '0 0 16px' }}>{t('screen_image')}</h2>

          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
            style={{
              display: 'grid',
              placeItems: 'center',
              minHeight: 220,
              padding: 16,
              border: `2px dashed ${dragging ? T.accent : T.cardBorder}`,
              borderRadius: 14,
              background: dragging ? `${T.accent}0d` : T.inputBg,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {preview ? (
              <img src={preview} alt="Selected scan" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 10, objectFit: 'contain' }} />
            ) : (
              <div style={{ textAlign: 'center', color: T.textMuted }}>
                <ImageUp size={30} color={T.textMuted} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: T.textSecondary }}>{t('screen_drop')}</div>
                <div style={{ fontSize: 12, marginTop: 3 }}>{t('screen_browse')}</div>
              </div>
            )}
          </div>

          <input ref={inputRef} type="file" accept="image/jpeg,image/png" onChange={(e) => handleFiles(e.target.files)} style={{ display: 'none' }} />

          {file && <p style={{ fontSize: 11.5, color: T.textMuted, margin: '8px 0 0', wordBreak: 'break-all' }}>{file.name}</p>}
          {errors.file && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '8px 0 0' }}>{errors.file}</p>}
          {apiError && (
            <div role="alert" style={{ marginTop: 14, padding: '11px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 10, fontSize: 12.5 }}>
              ⚠ {apiError}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexDirection: isMobile ? 'column' : 'row' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 26px', borderRadius: 12, border: 'none', background: loading ? T.textMuted : T.accent, color: '#fff', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <ScanLine size={15} /> {loading ? t('screen_analyzing') : t('screen_analyze')}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 22px', borderRadius: 12, border: `1px solid ${T.cardBorder}`, background: T.cardBg, color: T.textSecondary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              <RotateCcw size={14} /> {t('screen_reset')}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div style={card}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, margin: '0 0 16px' }}>{t('screen_result')}</h2>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${isConcerning(result.label) ? '#ef4444' : '#22c55e'}`,
                background: isConcerning(result.label) ? '#fef2f2' : '#f0fdf4',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: isConcerning(result.label) ? '#b91c1c' : '#15803d' }}>{result.label}</span>
              <span style={{ fontSize: 13, color: T.textMuted, fontVariantNumeric: 'tabular-nums' }}>{(result.confidence * 100).toFixed(1)}%</span>
            </div>

            <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
              {Object.entries(result.probabilities)
                .sort((a, b) => b[1] - a[1])
                .map(([name, value]) => (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5, color: T.textSecondary }}>
                      <span>{name}</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums', color: T.textMuted }}>{value.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: T.divider, overflow: 'hidden' }}>
                      <div style={{ width: `${value}%`, height: '100%', borderRadius: 4, background: isConcerning(name) ? '#ef4444' : '#22c55e', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
            </div>

            {result.processing_steps?.length > 0 && (
              <div style={{ marginTop: 22 }}>
                <h3 style={{ fontSize: 12.5, fontWeight: 700, color: T.textPrimary, margin: '0 0 12px' }}>{t('screen_processing')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: 12 }}>
                  {result.processing_steps.map((step) => (
                    <div key={step.label} style={{ textAlign: 'center' }}>
                      <img
                        src={step.image}
                        alt={step.label}
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, border: `1px solid ${T.cardBorder}` }}
                      />
                      <div style={{ fontSize: 10.5, color: T.textMuted, marginTop: 6 }}>{step.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submitted?.name && (
              <p style={{ fontSize: 12.5, color: T.textMuted, margin: '18px 0 0' }}>
                {submitted.name} · {submitted.gender} · {submitted.age}
                {submitted.abha ? ` · ABHA ${submitted.abha}` : ''}
              </p>
            )}
            <p style={{ fontSize: 11, color: T.textMuted, margin: '8px 0 0' }}>{t('screen_disclaimer')}</p>

            <div style={{ marginTop: 18 }}>
              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={reportBusy}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 22px', borderRadius: 12, border: 'none', background: reportBusy ? T.textMuted : T.accent, color: '#fff', fontWeight: 700, fontSize: 13, cursor: reportBusy ? 'not-allowed' : 'pointer' }}
              >
                <Download size={14} /> {reportBusy ? t('auth_processing') : t('screen_download_report')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
