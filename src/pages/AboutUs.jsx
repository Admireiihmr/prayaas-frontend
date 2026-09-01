import { Activity, Award, ChevronRight, FileText, Mail, MapPin, Microscope, Users, X } from 'lucide-react'
import { useState } from 'react'

import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useResponsive } from '@/hooks/useResponsive'

const LEADERSHIP = [
  {
    id: 'director',
    name: 'DR. USHA MANJUNATH',
    role: 'Professor & Director, IIHMR Bangalore',
    src: '/assets/Screenshot%202026-03-19%20220050.png',
    bio: 'Professor with 25+ years of experience. Leads the IIHMR institute and its AI healthcare initiatives.',
    email: 'director@ihmr.ai',
    tags: ['Healthcare Management', 'AI Research', 'Leadership'],
  },
  {
    id: 'admire',
    name: 'DR. AKASH PRABHUNE',
    role: 'Assistant Professor & Lead ADMIRE, IIHMR Bangalore',
    src: '/assets/Screenshot 2026-03-24 155953.png',
    bio: 'Lead of AI-driven Medical Research (ADMIRE). Spearheads cross-disciplinary projects combining oral oncology, data science, and clinical outcomes.',
    email: 'admire@ihmr.ai',
    tags: ['ADMIRE Lead', 'Clinical AI', 'Dentist'],
  },
]

// Team photos are background-removed onto white (originals in assets/_originals).
const TEAM = [
  { id: 'vs', name: 'MR. VINAY R SRIHARI', role: 'Assistant Professor, IIHMR Bangalore', src: '/assets/vinay-white.png', bio: 'Expert in health management research and AI-driven medical solutions.', tags: ['Health Management', 'Research', 'AI'] },
  { id: 'at', name: 'MR. ANKUR THAKUR', role: 'Full Stack Developer, IIHMR Bangalore', src: '/assets/ankur-white.png', bio: 'Builds and maintains the Prayaas web application.', tags: ['Full Stack', 'React', 'FastAPI'] },
  { id: 'ak', name: 'MS. AKILA', role: 'Data Scientist, IIHMR Bangalore', src: '/assets/akila-white.png', bio: 'Works on CNN-based screening models and evaluation.', tags: ['PyTorch', 'CNN', 'Image Processing'] },
  { id: 'hb', name: 'MR. HEMANTH B', role: 'Full Stack Developer & Research Officer, IIHMR Bangalore', src: '/assets/hemanth-white.png', bio: 'Built the Prayaas oral cancer screening pipeline and web app.', tags: ['Full Stack', 'Screening Pipeline', 'Computer Vision'] },
]

const PAPERS = [
  {
    id: 1,
    title: 'AI-based Screening for Oral Cancer and Premalignant Lesions from Oral Cavity Images',
    authors: 'IIHMR Bangalore — ADMIRE',
    journal: 'IIHMR Bangalore',
    year: '2025',
    abstract:
      'We present a deep learning pipeline that classifies oral cavity images into three clinically meaningful classes — oral cancer, no abnormality, and oral premalignant lesion (OPMD). Evaluated on 700 labelled images, the model reaches 89.0% accuracy with 0.86 recall on cancer cases.',
    pdfUrl: '#',
  },
]

/**
 * Square photo that shrinks with its container. A fixed pixel size cannot get
 * smaller than its column, which is what pushed the team grid off-screen on
 * narrow viewports — hence max-width + aspect-ratio rather than width/height.
 */
function PersonPhoto({ src, name, max, radius, accent, position = 'center' }) {
  // Initials from the display name, dropping any honorific (MR./MS./DR.) and
  // punctuation, so "MR. ANKUR THAKUR" -> "AT", not ".A".
  const initials = name
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z]/g, ''))
    .filter((w) => w && !/^(MR|MS|MRS|DR)$/i.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: '100%',
        maxWidth: max,
        aspectRatio: '1 / 1',
        borderRadius: radius,
        overflow: 'hidden',
        flexShrink: 0,
        border: `4px solid ${accent}33`,
        boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${accent}14`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          onError={(e) => {
            // Broken/missing file: fall back to the initials placeholder.
            e.target.style.display = 'none'
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, display: 'block' }}
        />
      ) : (
        <span style={{ fontSize: 'clamp(28px, 22%, 56px)', fontWeight: 700, color: accent, letterSpacing: 1 }}>
          {initials}
        </span>
      )}
    </div>
  )
}

function PaperModal({ paper, T, t, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: T.modalBack, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }} onClick={onClose}>
      <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${T.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={17} color={T.accent} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: 1, textTransform: 'uppercase' }}>Research Paper</div>
              <div style={{ fontSize: 10, color: T.textMuted }}>{paper.journal} · {paper.year}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${T.cardBorder}`, background: T.cardBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} color={T.textMuted} />
          </button>
        </div>
        <div style={{ padding: '22px 24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, lineHeight: 1.5, margin: '0 0 8px' }}>{paper.title}</h2>
          <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: '0 0 18px' }}>{paper.authors}</p>
          <div style={{ background: `${T.accent}0d`, border: `1px solid ${T.accent}22`, borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Abstract</div>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>{paper.abstract}</p>
          </div>
          <button onClick={onClose} style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: `1px solid ${T.cardBorder}`, background: T.cardBg, color: T.textSecondary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            {t('common_close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AboutUs() {
  const { theme: T } = useTheme()
  const { t } = useLanguage()
  const { isMobile, isTablet } = useResponsive()
  const [activePaper, setActivePaper] = useState(null)

  const card = { background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 18, boxShadow: T.cardShadow, minWidth: 0 }
  const pagePad = isMobile ? '20px 16px' : isTablet ? '24px 20px' : '32px 40px'
  const oneCol = isMobile || isTablet

  // auto-fit + minmax lets each grid reflow at whatever width it actually has,
  // instead of jumping between three hard-coded breakpoints and overflowing in
  // between. minmax's floor is 0 so a column can always shrink below its ideal.
  const autoGrid = (ideal) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${ideal}px, 100%), 1fr))`,
  })

  // Numbers come from the model evaluation over the 700 labelled images.
  const stats = [
    { icon: Activity, label: t('about_screened'), value: '700' },
    { icon: Award, label: t('about_accuracy'), value: '89.0%' },
    { icon: Users, label: t('about_hospitals'), value: '1' },
    { icon: Microscope, label: t('about_papers'), value: `${PAPERS.length}`, click: true },
  ]

  return (
    <div style={{ padding: pagePad, background: T.pageBg, minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #0c2a4a, ${T.accent})`, borderRadius: 20, padding: isMobile ? '24px 20px' : '28px 32px', marginBottom: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          {/* Inverted to white rather than sat on a white chip — the mark is
              black artwork on transparent and the hero is a navy gradient. */}
          <img
            src="/cropped-cropped-IIHMR-Logo-03.png"
            alt="IIHMR Bangalore"
            style={{ height: 30, width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block', filter: 'invert(1) brightness(1.7)', marginBottom: 12 }}
          />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 500, letterSpacing: 1, display: 'block', marginBottom: 8 }}>IIHMR.AI</span>
          <h1 style={{ color: '#fff', fontSize: isMobile ? 19 : 22, fontWeight: 700, margin: '0 0 8px' }}>{t('about_title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
            Institute of Health Management Research (IIHMR), Bangalore, is a premier institution specializing in
            healthcare management education, research, and training. Established in 2004, it serves as the South Campus
            of the IIHMR Group.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <a
            href="https://maps.google.com/?q=IIHMR+Bangalore"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 10, textDecoration: 'none' }}
          >
            <MapPin size={12} /> Bangalore, India
          </a>
          <a
            href="mailto:admire.digihealth@iihmrbangalore.edu.in"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 10, textDecoration: 'none', maxWidth: '100%', minWidth: 0 }}
          >
            <Mail size={12} style={{ flexShrink: 0 }} />
            {/* Long address: wrap rather than push the hero wider than the page. */}
            <span style={{ overflowWrap: 'anywhere' }}>admire.digihealth@iihmrbangalore.edu.in</span>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ ...autoGrid(140), gap: 14, marginBottom: 24 }}>
        {stats.map(({ icon: Icon, label, value, click }) => (
          <div
            key={label}
            onClick={click ? () => document.getElementById('research-papers')?.scrollIntoView({ behavior: 'smooth' }) : undefined}
            style={{ ...card, padding: 20, textAlign: 'center', cursor: click ? 'pointer' : 'default', ...(click ? { border: `1px solid ${T.accent}55` } : {}) }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${T.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon size={18} color={T.accent} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>{value}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3, fontWeight: 500 }}>{label}</div>
            {click && <div style={{ fontSize: 10, color: T.accent, marginTop: 4, fontWeight: 600 }}>View all →</div>}
          </div>
        ))}
      </div>

      {/* Mission + Tech */}
      <div style={{ ...autoGrid(280), gap: 16, marginBottom: 28 }}>
        {[
          { key: 'about_mission', body: 'To make oral cancer screening accessible at the point of primary care — turning a phone photograph of the oral cavity into a structured, AI-backed risk assessment that a health worker can act on immediately.' },
          { key: 'about_tech', body: 'A convolutional neural network operating on 224×224 images with CLAHE contrast enhancement, classifying into oral cancer, no abnormality, and premalignant lesion. Evaluated at 89.0% accuracy with 0.86 recall on cancer cases across 700 labelled images.' },
        ].map(({ key, body }) => (
          <div key={key} style={{ ...card, padding: 24 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>{t(key)}</h2>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>

      {/* Leadership */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0 }}>{t('about_leadership')}</h2>
          <div style={{ flex: 1, height: 1, background: T.divider }} />
        </div>
        <div style={{ ...autoGrid(340), gap: 18 }}>
          {LEADERSHIP.map((p) => (
            <div key={p.id} style={{ ...card, padding: 24, display: 'flex', flexDirection: oneCol ? 'column' : 'row', gap: 22, alignItems: oneCol ? 'center' : 'flex-start', textAlign: oneCol ? 'center' : 'left' }}>
              <PersonPhoto src={p.src} name={p.name} max={oneCol ? 200 : 180} radius={20} accent={T.accent} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, margin: '0 0 3px' }}>{p.name}</h3>
                <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: T.accentText, background: T.accent, padding: '2px 10px', borderRadius: 20, marginBottom: 10 }}>{p.role}</div>
                <p style={{ fontSize: 12.5, color: T.textSecondary, lineHeight: 1.7, margin: '0 0 12px' }}>{p.bio}</p>
                <a href={`mailto:${p.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, textDecoration: 'none' }}>
                  <Mail size={11} color={T.accent} />
                  <span style={{ fontSize: 11, color: T.textMuted }}>{p.email}</span>
                </a>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: oneCol ? 'center' : 'flex-start', gap: 5 }}>
                  {p.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: `${T.accent}14`, color: T.accent, border: `1px solid ${T.accent}33` }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0 }}>{t('about_team')}</h2>
          <div style={{ flex: 1, height: 1, background: T.divider }} />
        </div>
        <div style={{ ...autoGrid(210), gap: 16 }}>
          {TEAM.map((m) => (
            <div key={m.id} style={{ ...card, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Portraits are taller than wide; anchor the square crop to the
                  top so a centre crop never cuts the face off. */}
              <PersonPhoto src={m.src} name={m.name} max={200} radius={16} accent={T.accent} position="center top" />
              <div style={{ marginTop: 16, width: '100%' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 3 }}>{m.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 10 }}>{m.role}</div>
                <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.65, margin: '0 0 14px' }}>{m.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
                  {m.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: `${T.accent}14`, color: T.accent, border: `1px solid ${T.accent}33` }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Papers */}
      <div id="research-papers">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, margin: 0 }}>{t('about_papers')}</h2>
          <div style={{ background: `${T.accent}18`, color: T.accent, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, border: `1px solid ${T.accent}33` }}>
            {PAPERS.length} {t('about_publications')}
          </div>
          <div style={{ flex: 1, height: 1, background: T.divider }} />
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {PAPERS.map((paper, i) => (
            <div key={paper.id} onClick={() => setActivePaper(paper)} style={{ ...card, padding: '16px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color: T.accent }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 3, lineHeight: 1.4 }}>{paper.title}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>
                  <span style={{ color: T.accent, fontWeight: 500 }}>{paper.authors}</span> · {paper.journal} · {paper.year}
                </div>
              </div>
              <ChevronRight size={16} color={T.textMuted} />
            </div>
          ))}
        </div>
      </div>

      {activePaper && <PaperModal paper={activePaper} T={T} t={t} onClose={() => setActivePaper(null)} />}
    </div>
  )
}
