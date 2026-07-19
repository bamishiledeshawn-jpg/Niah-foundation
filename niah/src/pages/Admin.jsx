import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const STORAGE_KEY = 'niah_admin_token'

const CATEGORIES = [
  'Community Outreach',
  'Clinical Program',
  'Conference',
  'Workshop',
]

// ── Shared presentational components ─────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ldPm_mHg9ZUOsIVrVBOIRoLN9CGPgS4KpoW-U7f1FrdcbLvFIjSrqq71FXmYMFIhtMLoudtjlYLjHFkB3E4gdzMk4hsvOMUXTuTL165Y9ixuyF_GRuCHsb7wNIazvLBOpNXZAw6mTbMYXFj1hClXYVRw6D47YOpYvW3wTvCmV_SqvkZqcCjwIYQrN0iihxRZzA6eHXMPtEgGolAC6jQ1haW0eeay6ZhYag7sDvKTXLq5PQllESdSPVmlCtmxtEMjg70khjkz56g"
        alt="Niah Foundation"
        className="w-8 h-8 object-contain"
      />
      <span className="font-display font-bold text-primary text-lg leading-none">
        Niah Foundation
        <span className="block text-xs font-body font-semibold text-on-surface-variant tracking-widest uppercase">
          Admin
        </span>
      </span>
    </div>
  )
}

function StatCard({ icon, value, label, color = 'text-primary' }) {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/30 px-8 py-6 flex items-center gap-5">
      <span className={`material-symbols-outlined text-4xl ${color}`}>{icon}</span>
      <div>
        <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-on-surface-variant text-sm">{label}</p>
      </div>
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-error-container text-on-error-container rounded-xl px-5 py-4 text-sm flex items-center gap-3">
      <span className="material-symbols-outlined text-base shrink-0">error</span>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="underline text-xs shrink-0">Retry</button>
      )}
    </div>
  )
}

// ── Token login screen ────────────────────────────────────────────────────────

function TokenGate({ onAuthenticated }) {
  const [input,   setInput]   = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const token = input.trim()
    if (!token) { setError('Token is required.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.status === 401) {
        setError('Invalid token. Check the value set in ADMIN_TOKEN on the server.')
        return
      }
      if (!res.ok) {
        setError(`Server error (${res.status}). Make sure the backend is running.`)
        return
      }
      localStorage.setItem(STORAGE_KEY, token)
      onAuthenticated(token)
    } catch {
      setError('Could not reach the server. Is the Go backend running on port 8080?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-3xl border border-outline-variant/30 p-10 shadow-sm">
          <div className="mb-8"><Logo /></div>
          <h1 className="font-display text-2xl font-bold text-on-surface mb-1">Dashboard access</h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Enter the{' '}
            <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs">ADMIN_TOKEN</code>{' '}
            set when starting the Go server.
          </p>
          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm flex items-start gap-2 mb-6">
              <span className="material-symbols-outlined text-base mt-0.5 shrink-0">error</span>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">
                Admin Token
              </label>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Paste your token here"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 pr-12 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/40"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setVisible(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  aria-label={visible ? 'Hide token' : 'Show token'}
                >
                  <span className="material-symbols-outlined text-xl">
                    {visible ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  VERIFYING…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">lock_open</span>
                  SIGN IN
                </>
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-on-surface-variant mt-6">
          This page is not linked from the public site.
        </p>
      </div>
    </div>
  )
}

// ── Registrations tab ─────────────────────────────────────────────────────────

const REG_COLUMNS = [
  { key: 'name',       label: 'Name'      },
  { key: 'email',      label: 'Email'     },
  { key: 'phone',      label: 'Phone'     },
  { key: 'role',       label: 'Role'      },
  { key: 'message',    label: 'Message'   },
  { key: 'created_at', label: 'Submitted' },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function RegistrationsTab({ token }) {
  const [volunteers, setVolunteers] = useState([])
  const [count,      setCount]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setVolunteers(data.volunteers ?? [])
      setCount(data.count ?? 0)
    } catch {
      setError('Failed to load registrations. Check the backend is still running.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 30_000)
    return () => clearInterval(id)
  }, [fetchData])

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase()
    return (
      v.name?.toLowerCase().includes(q)  ||
      v.email?.toLowerCase().includes(q) ||
      v.role?.toLowerCase().includes(q)
    )
  })

  const roleCounts = volunteers.reduce((acc, v) => {
    const r = v.role || 'Unspecified'
    acc[r] = (acc[r] ?? 0) + 1
    return acc
  }, {})
  const topRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon="group"             value={count}                        label="Total registrations" color="text-primary"   />
        <StatCard icon="volunteer_activism" value={Object.keys(roleCounts).length} label="Distinct roles"     color="text-secondary" />
        <StatCard icon="star"              value={topRole}                      label="Most popular role"   color="text-tertiary"  />
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchData} />}

      {/* Table card */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="text-sm text-on-surface-variant">
            {loading ? 'Loading…' : `${filtered.length} of ${count} registration${count !== 1 ? 's' : ''}`}
          </p>
          <div className="relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, role…"
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            <span className="text-sm">Fetching registrations…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-5xl opacity-30">inbox</span>
            <p className="text-sm">{search ? 'No results match your search.' : 'No registrations yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  {REG_COLUMNS.map(col => (
                    <th key={col.key} className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-on-surface whitespace-nowrap">{v.name || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`mailto:${v.email}`} className="text-primary hover:underline">{v.email || '—'}</a>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{v.phone || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {v.role
                        ? <span className="bg-primary-fixed/60 text-on-primary-fixed text-xs font-semibold px-3 py-1 rounded-full">{v.role}</span>
                        : <span className="text-on-surface-variant">—</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant max-w-xs">
                      <p className="truncate" title={v.message || ''}>{v.message || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">{formatDate(v.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Events tab ────────────────────────────────────────────────────────────────

const EMPTY_EVENT = { title: '', category: '', location: '', description: '', event_date: '', latitude: 0, longitude: 0 }

function EventsTab({ token }) {
  const [events,     setEvents]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [form,       setForm]       = useState(EMPTY_EVENT)
  const [formError,  setFormError]  = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const authHeader = { 'Authorization': `Bearer ${token}` }

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Admin view fetches all events (public endpoint) — shows upcoming only,
      // which matches what visitors see, so admin knows exactly what's live.
      const res = await fetch(`${API_URL}/api/events`)
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setEvents(data.events ?? [])
    } catch {
      setError('Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.title.trim())      { setFormError('Title is required.');     return }
    if (!form.event_date.trim()) { setFormError('Event date is required.'); return }
    setFormError('')
    setSubmitting(true)
    try {
      // ── Geocode the location via Nominatim (free, no API key) ──────────
      let lat = 0
      let lon = 0
      if (form.location.trim()) {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(form.location)}`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const geoData = await geo.json()
        if (geoData.length > 0) {
          lat = parseFloat(geoData[0].lat)
          lon = parseFloat(geoData[0].lon)
        }
      }

      // ── POST to backend with coordinates included ──────────────────────
      const payload = { ...form, latitude: lat, longitude: lon }
      const res = await fetch(`${API_URL}/api/admin/events`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.error ?? 'Could not create event.'); return }
      setForm(EMPTY_EVENT)
      fetchEvents()
    } catch {
      setFormError('Network error. Check the backend is running.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      const res = await fetch(`${API_URL}/api/admin/events/${id}`, {
        method:  'DELETE',
        headers: authHeader,
      })
      if (!res.ok) throw new Error()
      setEvents(prev => prev.filter(ev => ev.id !== id))
    } catch {
      setError('Could not delete event. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div className="space-y-8">

      {/* ── Create form ── */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
          <h3 className="font-display text-base font-semibold text-on-surface">Add New Event</h3>
        </div>
        <div className="p-6 space-y-5">
          {formError && (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                className={inputClass}
                placeholder="World Mental Health Day Community Walk"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Category</label>
              <select value={form.category} onChange={set('category')} className={inputClass}>
                <option value="">Select a category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">
                Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={form.event_date}
                onChange={set('event_date')}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={set('location')}
                className={inputClass}
                placeholder="Lagos Island, Lagos"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={set('description')}
                className={inputClass}
                placeholder="Brief description of the event…"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                SAVING…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">add</span>
                CREATE EVENT
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Live events list ── */}
      <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">event</span>
            <h3 className="font-display text-base font-semibold text-on-surface">
              Live Upcoming Events
              {!loading && (
                <span className="ml-2 text-xs font-body font-normal text-on-surface-variant">
                  ({events.length})
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={fetchEvents}
            title="Refresh"
            className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-xl">refresh</span>
          </button>
        </div>

        {error && (
          <div className="px-6 py-4">
            <ErrorBanner message={error} onRetry={fetchEvents} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
            <span className="text-sm">Loading events…</span>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-5xl opacity-30">event_busy</span>
            <p className="text-sm">No upcoming events. Add one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {events.map(ev => {
              // Parse date for display — same logic as public Events page.
              const d     = new Date(ev.event_date + 'T00:00:00Z')
              const day   = String(d.getUTCDate()).padStart(2, '0')
              const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()

              return (
                <div key={ev.id} className="px-6 py-5 flex items-start gap-5 hover:bg-surface-container-low/50 transition-colors">
                  {/* Date badge */}
                  <div className="bg-primary text-on-primary rounded-xl px-4 py-3 text-center shrink-0 min-w-[60px]">
                    <span className="block font-display text-xl font-bold leading-none">{day}</span>
                    <span className="block text-xs font-semibold tracking-wider mt-1">{month}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {ev.category && (
                        <span className="bg-primary-fixed/60 text-on-primary-fixed text-xs font-semibold px-3 py-0.5 rounded-full">
                          {ev.category}
                        </span>
                      )}
                      {ev.location && (
                        <span className="text-on-surface-variant text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {ev.location}
                        </span>
                      )}
                    </div>
                    <p className="font-display text-base font-semibold text-on-surface">{ev.title}</p>
                    {ev.description && (
                      <p className="text-on-surface-variant text-xs leading-relaxed mt-1 line-clamp-2">{ev.description}</p>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(ev.id)}
                    disabled={deletingId === ev.id}
                    title="Delete event"
                    className="shrink-0 p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container
                               transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deletingId === ev.id
                      ? <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined text-xl">delete</span>
                    }
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Dashboard shell ───────────────────────────────────────────────────────────

function Dashboard({ token, onSignOut }) {
  const [tab, setTab] = useState('registrations') // 'registrations' | 'events'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-outline-variant/30 px-10 py-4">
        <div className="max-w-container-max mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-on-surface-variant text-sm hidden sm:block">
              Auto-refreshes every 30 s
            </span>
            <button
              onClick={() => { localStorage.removeItem(STORAGE_KEY); onSignOut() }}
              className="btn-secondary !py-2 !px-5 text-xs"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-10 py-10 space-y-8">
        {/* Page title */}
        <div>
          <span className="section-eyebrow">ADMIN DASHBOARD</span>
          <h1 className="font-display text-3xl font-bold text-on-surface">Niah Foundation</h1>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 bg-surface-container p-1 rounded-2xl w-fit border border-outline-variant/20">
          {[
            { key: 'registrations', icon: 'group',      label: 'Registrations' },
            { key: 'events',        icon: 'event',       label: 'Events'        },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-surface text-primary shadow-sm border border-outline-variant/30'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'registrations' && <RegistrationsTab token={token} />}
        {tab === 'events'        && <EventsTab        token={token} />}
      </main>
    </div>
  )
}

// ── Root — manages auth state ─────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '')

  if (!token) return <TokenGate onAuthenticated={setToken} />
  return <Dashboard token={token} onSignOut={() => setToken('')} />
}