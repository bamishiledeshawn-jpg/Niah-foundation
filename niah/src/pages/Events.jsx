import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import PageHero from '../components/PageHero'
import DonateStrip from '../components/DonateStrip'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const brandIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z"
            fill="#4a654f" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="#fff"/>
    </svg>
  `)}`,
  iconSize:    [32, 42],
  iconAnchor:  [16, 42],
  popupAnchor: [0, -44],
})

const CATEGORY_COLORS = {
  'Community Outreach': 'bg-primary-fixed text-on-primary-fixed',
  'Clinical Program':   'bg-secondary-fixed text-on-secondary-container',
  'Conference':         'bg-tertiary-fixed text-on-tertiary-container',
  'Workshop':           'bg-primary-fixed text-on-primary-fixed',
}
const DEFAULT_COLOR = 'bg-surface-variant text-on-surface-variant'

function parseEventDate(isoString) {
  if (!isoString) return { day: '??', month: '???' }
  const d     = new Date(isoString + 'T00:00:00Z')
  const day   = String(d.getUTCDate()).padStart(2, '0')
  const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  return { day, month }
}

function mapEvents(events) {
  return events.filter(ev => ev.latitude !== 0 || ev.longitude !== 0)
}

const NIGERIA_CENTER = [9.082, 8.6753]

// ── Past events data ──────────────────────────────────────────────────────────
// Replace image paths with real photos — put files in niah/public/images/past-events/
const PAST_EVENTS = [
  {
    id: 1,
    title: "A Pad for Her Outreach",
    location: "Prismoni Comprehensive High School",
    year: "2024",
    reach: "100+ girls",
    fullDescription: "At Prismoni Comprehensive High School, our \'A Pad for Her\' initiative successfully provided menstrual hygiene products to 100 girls, ensuring their continued access to education without disruptions.",
    images: [
      "/images/past-events/pad-outreach-1.jpg",
      "/images/past-events/pad-outreach-2.jpg",
    ],
  },
  {
    id: 2,
    title: "Medical Outreach (#SarahGoesToSchool)",
    location: "Alagbado, Lagos",
    year: "2024",
    reach: "150+ beneficiaries",
    fullDescription: "On the 20th of September, we provided medication, free consultations, blood pressure tests and more to about 150 beneficiaries in Alagbado. Our medical outreach became a celebration of hope — Sarah, the daughter of one of our beneficiaries, became the first recipient of our #SarahGoesToSchool campaign. As fate would have it, it was also her birthday, and thanks to the incredible support of our volunteers and donors, we raised enough funds to enroll Sarah in school.",
    images: [
      "/images/past-events/medical-1.jpg",
      "/images/past-events/medical-2.jpg",
    ],
  },
  {
    id: 3,
    title: "Blood Drive",
    location: "Massey Children's Hospital",
    year: "2024",
    reach: "Pints donated",
    fullDescription: "We contributed to life-saving efforts at Massey Children's Hospital by donating pints of blood during our impactful blood drive on the 2nd of December.",
    images: [
      "/images/past-events/blood-1.jpg",
      "/images/past-events/blood-2.jpg",
    ],
  },
  {
    id: 4,
    title: "Food Outreach",
    location: "Shangisha Community",
    year: "2024",
    reach: "100+ elderly people",
    fullDescription: "We provided foodstuff to over 100 elderly people in the Shangisha community, in an engaging and gamified format on the 24th of May.",
    images: [
      "/images/past-events/food-1.jpg",
      "/images/past-events/food-2.jpg",
    ],
  },
  {
    id: 5,
    title: "Art Supply Drive",
    location: "Hamros Primary School, Ketu",
    year: "2024",
    reach: "Art therapy session",
    fullDescription: "On the 6th of December we visited the lovely kids at Hamros Primary School in the Ketu community. We donated art supplies and held an art and mental health talk session where students created artwork based on the mental health facts they learnt during the session.",
    images: [
      "/images/past-events/art-1.jpg",
      "/images/past-events/art-2.jpg",
    ],
  },
  {
    id: 6,
    title: "School Revamp",
    location: "Prismoni Comprehensive High School",
    year: "2024",
    reach: "Transformative makeover",
    fullDescription: "Prismoni Comprehensive High School underwent a transformative makeover as we painted its walls and built new tables, creating a conducive and uplifting learning environment for students.",
    images: [
      "/images/past-events/revamp-1.jpg",
      "/images/past-events/revamp-2.jpg",
    ],
  },
]

// ── Slide-over drawer ─────────────────────────────────────────────────────────

function PastEventDrawer({ event, onClose }) {
  const [activeImg, setActiveImg] = useState(0)

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Drawer panel — slides in from right */}
      <div
        className="relative ml-auto h-full w-full max-w-2xl bg-surface shadow-2xl flex flex-col"
        style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-outline-variant/30 shrink-0">
          <div>
            <span className="section-eyebrow">{event.year} · {event.location}</span>
            <h2 className="font-display text-2xl font-bold text-on-surface mt-1 leading-tight">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-7 space-y-8">

          {/* Reach badge */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">volunteer_activism</span>
            <span className="bg-primary-fixed/50 text-on-primary-fixed text-sm font-semibold px-4 py-1.5 rounded-full">
              {event.reach}
            </span>
          </div>

          {/* Hero image — main lightbox preview */}
          <div className="rounded-2xl overflow-hidden border border-outline-variant/20 shadow-md aspect-video">
            <img
              src={event.images[activeImg]}
              alt={`${event.title} photo ${activeImg + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* Thumbnail strip */}
          {event.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {event.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i
                      ? 'border-primary shadow-md scale-105'
                      : 'border-outline-variant/30 hover:border-primary/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Narrative */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">article</span>
              Impact Report
            </h3>
            {event.fullDescription.split('\n\n').map((para, i) => (
              <p key={i} className="text-on-surface-variant text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Full photo grid */}
          <div>
            <h3 className="font-display text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">photo_library</span>
              Photo Gallery
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {event.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="rounded-xl overflow-hidden aspect-video border border-outline-variant/20
                             hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                >
                  <img
                    src={img}
                    alt={`Gallery photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Events() {
  const [events,       setEvents]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [activeDrawer, setActiveDrawer] = useState(null) // past event object | null

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        return res.json()
      })
      .then(data => setEvents(data.events ?? []))
      .catch(() => setError('Could not load upcoming events. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const mappable  = mapEvents(events)
  const mapCenter = mappable.length > 0
    ? [
        mappable.reduce((s, e) => s + e.latitude,  0) / mappable.length,
        mappable.reduce((s, e) => s + e.longitude, 0) / mappable.length,
      ]
    : NIGERIA_CENTER

  return (
    <>
      <PageHero
        eyebrow="EVENTS"
        title="Where community turns into change."
        subtitle="From clinical programs to public awareness walks, our events create the connections that sustain mental health support at scale."
        imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpUBpJIE-TNn3ddrG8cEqN_QphDMDYm04UtF-FSD2T9Xt7hBNHktUCJksrB3CnFk4PqQpBF0nLzpn1YTvqyChfbON15_KcgM0y2S8PUGRmQF8q2-0cCRAvSOyEfkZuQqGpDC9ia3pQ6QmFVmEzOl5BpEih82ycH0cM5aFShRSwUEIDmYiA0V0_sz6d4YJAmJleBhKdi8EnYK3tLIwIHRWvTL2EEgJBBt_JE9p9rRozhvQoXJkMz_C4zW-vgRn-SK3aF3BkEQ21Us"
      />

      {/* ── Map ── */}
      {!loading && !error && (
        <section className="py-20 bg-surface-container">
          <div className="max-w-container-max mx-auto px-10">
            <div className="mb-8">
              <span className="section-eyebrow">EVENT LOCATIONS</span>
              <h2 className="section-title">Find us near you.</h2>
              {mappable.length === 0 && events.length > 0 && (
                <p className="text-on-surface-variant text-sm mt-2">
                  No location data for current events yet — add addresses in the admin dashboard.
                </p>
              )}
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-outline-variant/30 h-[420px] md:h-[500px]">
              <MapContainer
                center={mapCenter}
                zoom={mappable.length > 0 ? 6 : 5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mappable.map(ev => {
                  const { day, month } = parseEventDate(ev.event_date)
                  return (
                    <Marker key={ev.id} position={[ev.latitude, ev.longitude]} icon={brandIcon}>
                      <Popup>
                        <div style={{ minWidth: 180 }}>
                          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#1b1c1a' }}>{ev.title}</p>
                          <p style={{ fontSize: 12, color: '#424842', marginBottom: 2 }}>📅 {day} {month}</p>
                          {ev.location && <p style={{ fontSize: 12, color: '#424842', marginBottom: 2 }}>📍 {ev.location}</p>}
                          {ev.category && <p style={{ fontSize: 11, color: '#4a654f', fontWeight: 600, marginTop: 6 }}>{ev.category}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </div>
        </section>
      )}

      {/* ── Upcoming ── */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12">
            <span className="section-eyebrow">COMING UP</span>
            <h2 className="section-title">Upcoming Events</h2>
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-on-surface-variant py-16 justify-center">
              <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
              <span className="text-sm">Loading events…</span>
            </div>
          )}

          {!loading && error && (
            <div className="bg-error-container text-on-error-container rounded-xl px-5 py-4 text-sm flex items-center gap-3 max-w-xl">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              {error}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
              <span className="material-symbols-outlined text-5xl opacity-30">event_busy</span>
              <p className="text-sm">No upcoming events at the moment. Check back soon.</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="space-y-6">
              {events.map(ev => {
                const { day, month } = parseEventDate(ev.event_date)
                const pillColor = CATEGORY_COLORS[ev.category] ?? DEFAULT_COLOR
                return (
                  <div key={ev.id} className="card p-8 flex flex-col sm:flex-row gap-8 items-start">
                    <div className="bg-primary text-on-primary rounded-2xl px-6 py-4 text-center shrink-0 min-w-[80px]">
                      <span className="block font-display text-3xl font-bold">{day}</span>
                      <span className="block text-xs font-semibold tracking-widest mt-1">{month}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {ev.category && (
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pillColor}`}>
                            {ev.category}
                          </span>
                        )}
                        {ev.location && (
                          <span className="text-on-surface-variant text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {ev.location}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-on-surface mb-2">{ev.title}</h3>
                      {ev.description && (
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{ev.description}</p>
                      )}
                      <button className="btn-primary text-xs py-2 px-6">REGISTER</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Past events — interactive cards ── */}
      <section className="py-20 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12">
            <span className="section-eyebrow">WHAT WE'VE DONE</span>
            <h2 className="section-title">Past Events</h2>
            <p className="text-on-surface-variant text-sm mt-2">Click any event to read the full story and view photos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAST_EVENTS.map(ev => (
              <button
                key={ev.id}
                onClick={() => setActiveDrawer(ev)}
                className="card p-8 text-left group hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full"
              >
                <span className="text-xs font-semibold text-outline">{ev.year}</span>
                <h3 className="font-display text-lg font-semibold text-on-surface mt-2 mb-1 group-hover:text-primary transition-colors">
                  {ev.title}
                </h3>
                <p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {ev.location}
                </p>
                <div className="flex items-center justify-between">
                  <div className="bg-primary-fixed/40 text-on-primary-fixed rounded-full px-4 py-1 inline-block text-xs font-semibold">
                    {ev.reach}
                  </div>
                  <span className="material-symbols-outlined text-primary text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <DonateStrip />

      {/* Drawer */}
      {activeDrawer && (
        <PastEventDrawer
          event={activeDrawer}
          onClose={() => setActiveDrawer(null)}
        />
      )}
    </>
  )
}