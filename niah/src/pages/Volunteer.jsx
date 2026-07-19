import { useState } from 'react'
import PageHero from '../components/PageHero'

// Matches the Go handler's volunteerRequest struct field names exactly.
const EMPTY_FORM = { name: '', email: '', phone: '', role: '', message: '' }

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const ROLES = [
  {
    icon: 'psychology',
    title: 'Clinical Volunteer',
    commitment: '4–8 hrs/week',
    desc: 'Therapists, counsellors, and psychiatrists providing supervised pro-bono sessions at our community clinics.',
    req: 'Licensed mental health professional',
  },
  {
    icon: 'school',
    title: 'School Facilitator',
    commitment: '2–4 hrs/week',
    desc: 'Deliver our evidence-based mental health curriculum in secondary schools across your state.',
    req: 'Teaching background preferred',
  },
  {
    icon: 'campaign',
    title: 'Community Ambassador',
    commitment: 'Flexible',
    desc: 'Represent Niah at community events, share resources, and break stigma in your local network.',
    req: 'No specific qualifications required',
  },
  {
    icon: 'code',
    title: 'Tech & Digital',
    commitment: 'Project-based',
    desc: 'Help us build and maintain the digital tools that extend our reach — from our website to our outreach platforms.',
    req: 'Web, design, or data skills',
  },
  {
    icon: 'record_voice_over',
    title: 'Content Creator',
    commitment: 'Flexible',
    desc: 'Write, illustrate, photograph, or produce video content that helps us reach more Nigerians online.',
    req: 'Portfolio preferred',
  },
  {
    icon: 'inventory',
    title: 'Logistics & Events',
    commitment: 'Event-based',
    desc: 'Coordinate logistics, set up venues, and ensure our outreach events run without a hitch.',
    req: 'Organized, reliable, available on event dates',
  },
]

// ── Input component ───────────────────────────────────────────────────────────
// Extracted to avoid repeating the same className string six times.
function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/40 ' +
  'aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/40'

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Volunteer() {
  const [form, setForm]         = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})  // per-field validation from server
  const [networkError, setNetworkError] = useState('') // network / unexpected errors
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  // Map a server error message to the field it belongs to so we can
  // render it inline. Anything unrecognised falls through to networkError.
  function classifyServerError(msg) {
    const fieldMap = {
      name:    ['name'],
      email:   ['email'],
      phone:   ['phone'],
      role:    ['role'],
      message: ['message'],
    }
    for (const [field, keywords] of Object.entries(fieldMap)) {
      if (keywords.some((kw) => msg.toLowerCase().includes(kw))) {
        return { type: 'field', field }
      }
    }
    return { type: 'network' }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldErrors({})
    setNetworkError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        // The Go backend always returns { "error": "..." } on failure.
        const msg = data?.error ?? 'Something went wrong. Please try again.'

        if (res.status === 409) {
          // Duplicate email — point directly at the field.
          setFieldErrors({ email: msg })
        } else if (res.status === 422) {
          // Validation error — classify which field owns it.
          const { type, field } = classifyServerError(msg)
          if (type === 'field') {
            setFieldErrors({ [field]: msg })
          } else {
            setNetworkError(msg)
          }
        } else {
          setNetworkError(msg)
        }
        return
      }

      // 201 Created — registration successful.
      setSubmitted(true)

    } catch {
      // fetch() itself throws only on true network failure (offline, DNS, CORS).
      setNetworkError(
        'Could not reach the server. Check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="VOLUNTEER"
        title="Give your skills. Change a life."
        subtitle="Whether you're a clinician, a teacher, or a developer — there is a place for you in this mission."
        imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpUBpJIE-TNn3ddrG8cEqN_QphDMDYm04UtF-FSD2T9Xt7hBNHktUCJksrB3CnFk4PqQpBF0nLzpn1YTvqyChfbON15_KcgM0y2S8PUGRmQF8q2-0cCRAvSOyEfkZuQqGpDC9ia3pQ6QmFVmEzOl5BpEih82ycH0cM5aFShRSwUEIDmYiA0V0_sz6d4YJAmJleBhKdi8EnYK3tLIwIHRWvTL2EEgJBBt_JE9p9rRozhvQoXJkMz_C4zW-vgRn-SK3aF3BkEQ21Us"
      />

      {/* Role cards — unchanged */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12">
            <span className="section-eyebrow">OPEN ROLES</span>
            <h2 className="section-title">Ways to contribute.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLES.map(({ icon, title, commitment, desc, req }) => (
              <div key={title} className="card p-8 flex flex-col gap-4">
                <span className="material-symbols-outlined text-primary text-4xl">{icon}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-on-surface mb-1">{title}</h3>
                  <span className="text-xs font-semibold text-secondary bg-secondary-fixed/30 px-3 py-1 rounded-full">
                    {commitment}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed flex-1">{desc}</p>
                <p className="text-xs text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {req}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up form */}
      <section className="py-20 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10">
          <div className="max-w-2xl mx-auto">
            <span className="section-eyebrow">APPLY</span>
            <h2 className="section-title mb-8">Sign up to volunteer.</h2>

            {submitted ? (
              // ── Success state ──────────────────────────────────────────
              <div className="card p-12 text-center">
                <span className="material-symbols-outlined text-primary text-6xl mb-4 block">
                  check_circle
                </span>
                <h3 className="font-display text-2xl font-semibold text-on-surface mb-3">
                  Application received
                </h3>
                <p className="text-on-surface-variant">
                  We'll reach out to you within 5 business days. Thank you for joining our mission.
                </p>
              </div>
            ) : (
              // ── Form ───────────────────────────────────────────────────
              <div className="card p-10 space-y-6">

                {/* Network / server error banner */}
                {networkError && (
                  <div className="bg-error-container text-on-error-container rounded-xl px-5 py-4 text-sm flex items-start gap-3">
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0">warning</span>
                    <span>{networkError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Full Name" error={fieldErrors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      aria-invalid={!!fieldErrors.name}
                      className={inputClass}
                      placeholder="Amaka Obi"
                    />
                  </Field>

                  <Field label="Email" error={fieldErrors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      aria-invalid={!!fieldErrors.email}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>

                <Field label="Phone" error={fieldErrors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    aria-invalid={!!fieldErrors.phone}
                    className={inputClass}
                    placeholder="+234 801 234 5678"
                  />
                </Field>

                <Field label="Preferred Role" error={fieldErrors.role}>
                  <select
                    value={form.role}
                    onChange={set('role')}
                    aria-invalid={!!fieldErrors.role}
                    className={inputClass}
                  >
                    <option value="">Select a role…</option>
                    {ROLES.map((r) => (
                      <option key={r.title} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Tell us about yourself" error={fieldErrors.message}>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    aria-invalid={!!fieldErrors.message}
                    className={inputClass}
                    placeholder="Your background, availability, and what draws you to this work…"
                  />
                </Field>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">
                        progress_activity
                      </span>
                      SUBMITTING…
                    </>
                  ) : (
                    'SUBMIT APPLICATION'
                  )}
                </button>

              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
