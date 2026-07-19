import { useState } from 'react'
import PageHero from '../components/PageHero'
import { usePaystack } from '../hooks/usePaystack'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const PRESETS = [500, 5000, 50000]

const CONTACT_CHANNELS = [
  { icon: 'mail',        label: 'Email',   value: 'niahfoundation@gmail.com'                           },
  { icon: 'phone',       label: 'Phone',   value: '07067561557'                                         },
  { icon: 'location_on', label: 'Address', value: 'Estate Plaza, Emmanuel Keshi, Magodo Phase 2, Lagos, Nigeria.' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/niah.foundation/',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/company/niah-foundation/',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

// ── Donation block ────────────────────────────────────────────────────────────

function DonationBlock() {
  const [email,    setEmail]    = useState('')
  const [selected, setSelected] = useState(5000)
  const [custom,   setCustom]   = useState('')
  const [status,   setStatus]   = useState('idle')
  const [message,  setMessage]  = useState('')

  const openPaystack = usePaystack()

  function nairaAmount() {
    const c = parseInt(custom, 10)
    return !isNaN(c) && c >= 100 ? c : selected
  }

  async function handleDonate() {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    const amount = nairaAmount()
    if (amount < 100) {
      setStatus('error')
      setMessage('Minimum donation is ₦100.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      await openPaystack({
        email,
        amountInKobo: amount * 100,
        metadata: { source: 'niah-contact-page' },
        onSuccess: ({ verified, payment, error }) => {
          if (verified) {
            setStatus('success')
            setMessage(`Thank you! ₦${(payment.amount / 100).toLocaleString()} received. We'll send a receipt to ${payment.email}.`)
            setEmail('')
            setCustom('')
            setSelected(5000)
          } else {
            setStatus('error')
            setMessage(error ?? 'Payment could not be verified. Please contact us.')
          }
        },
        onClose: () => setStatus('idle'),
      })
    } catch (err) {
      console.error('PAYSTACK OPEN ERROR:', err)
      setStatus('error')
      setMessage('Could not open payment window. Check your connection and try again.')
    }
  }

  const inputClass =
    'w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div id="donate" className="bg-primary rounded-[2rem] p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: 100 }}>favorite</span>
      </div>

      <span className="section-eyebrow">MAKE A DONATION</span>
      <h2 className="font-display text-3xl font-bold text-on-primary mb-2">Support our mission.</h2>
      <p className="text-on-primary/70 text-sm mb-8 leading-relaxed">
        Every naira funds therapy sessions, outreach programs, and care for Nigerians living with mental health challenges.
      </p>

      {status === 'success' ? (
        <div className="bg-surface rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-primary text-6xl mb-4 block">check_circle</span>
          <h3 className="font-display text-xl font-semibold text-on-surface mb-2">Donation received</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">{message}</p>
          <button onClick={() => { setStatus('idle'); setMessage('') }} className="mt-6 btn-secondary text-xs">
            DONATE AGAIN
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-on-primary/80 uppercase tracking-wide block mb-2">Your Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-semibold text-on-primary/80 uppercase tracking-wide block mb-3">Select Amount (₦)</label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {PRESETS.map(p => (
                <button key={p} onClick={() => { setSelected(p); setCustom('') }}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    selected === p && !custom
                      ? 'bg-surface text-primary border-surface'
                      : 'bg-transparent text-on-primary border-on-primary/30 hover:border-on-primary/60'
                  }`}>
                  ₦{p.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold">₦</span>
              <input type="number" min="100" value={custom}
                onChange={e => { setCustom(e.target.value); setSelected(0) }}
                placeholder="Enter any amount (min. ₦100)"
                className={`${inputClass} pl-8`} />
            </div>
          </div>

          <div className="bg-surface/20 rounded-xl px-5 py-3 flex justify-between items-center">
            <span className="text-on-primary/70 text-sm">You're donating</span>
            <span className="font-display text-2xl font-bold text-on-primary">₦{nairaAmount().toLocaleString()}</span>
          </div>

          {status === 'error' && (
            <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              {message}
            </div>
          )}

          <button onClick={handleDonate} disabled={status === 'loading'}
            className="w-full bg-surface text-primary font-bold py-4 rounded-xl text-sm tracking-widest uppercase
                       hover:bg-surface/90 active:scale-95 transition-all flex justify-center items-center gap-2
                       disabled:opacity-60 disabled:cursor-not-allowed">
            {status === 'loading' ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                OPENING PAYSTACK…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">lock</span>
                DONATE ₦{nairaAmount().toLocaleString()} SECURELY
              </>
            )}
          </button>

          <p className="text-on-primary/50 text-xs text-center">
            Secured by Paystack · Card details never touch our server
          </p>
        </div>
      )}
    </div>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const inputClass =
    'w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div>
      <span className="section-eyebrow">SEND A MESSAGE</span>
      <h2 className="section-title mb-8">Get in touch.</h2>

      {submitted ? (
        <div className="card p-12 text-center">
          <span className="material-symbols-outlined text-primary text-6xl mb-4 block">mark_email_read</span>
          <h3 className="font-display text-2xl font-semibold text-on-surface mb-3">Message sent</h3>
          <p className="text-on-surface-variant">We'll respond within 2 business days.</p>
        </div>
      ) : (
        <div className="card p-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Name</label>
              <input type="text" value={form.name} onChange={set('name')} className={inputClass} placeholder="Your full name" />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Email</label>
              <input type="email" value={form.email} onChange={set('email')} className={inputClass} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Subject</label>
            <select value={form.subject} onChange={set('subject')} className={inputClass}>
              <option value="">Select a topic…</option>
              <option>Donation enquiry</option>
              <option>Partnership / sponsorship</option>
              <option>Volunteering</option>
              <option>Media & press</option>
              <option>General enquiry</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">Message</label>
            <textarea rows={5} value={form.message} onChange={set('message')} className={inputClass} placeholder="How can we help?" />
          </div>
          <button onClick={() => setSubmitted(true)} className="btn-primary w-full flex justify-center">
            SEND MESSAGE
          </button>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT & DONATE"
        title="Let's talk. We're listening."
        subtitle="Whether you want to donate, partner, or simply reach out — we'd love to hear from you."
        imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpUBpJIE-TNn3ddrG8cEqN_QphDMDYm04UtF-FSD2T9Xt7hBNHktUCJksrB3CnFk4PqQpBF0nLzpn1YTvqyChfbON15_KcgM0y2S8PUGRmQF8q2-0cCRAvSOyEfkZuQqGpDC9ia3pQ6QmFVmEzOl5BpEih82ycH0cM5aFShRSwUEIDmYiA0V0_sz6d4YJAmJleBhKdi8EnYK3tLIwIHRWvTL2EEgJBBt_JE9p9rRozhvQoXJkMz_C4zW-vgRn-SK3aF3BkEQ21Us"
      />

      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10 space-y-16">

          <DonationBlock />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm />

            <div className="space-y-8">
              <div>
                <span className="section-eyebrow">REACH US</span>
                <div className="space-y-5 mt-4">
                  {CONTACT_CHANNELS.map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-5 card p-6">
                      <span className="material-symbols-outlined text-primary text-2xl mt-0.5">{icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-outline uppercase tracking-wide mb-1">{label}</p>
                        <p className="text-on-surface text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="section-eyebrow">FOLLOW US</span>
                <div className="flex gap-4 mt-4">
                  {SOCIALS.map(({ label, href, svg }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex items-center gap-2.5 card px-5 py-3 text-on-surface-variant
                                 hover:text-primary hover:border-primary/40 transition-all group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{svg}</span>
                      <span className="text-sm font-semibold">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-highest p-8 rounded-2xl border border-outline-variant space-y-5">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-widest">Why donate online?</h4>
                {[
                  { icon: 'verified',     title: 'Instant & secure',   body: 'Paystack encrypts every transaction. Your card details never touch our server.' },
                  { icon: 'receipt_long', title: 'Email receipt',       body: 'You receive confirmation immediately after your donation is processed.'         },
                  { icon: 'favorite',     title: '100% to the mission', body: 'Every naira goes directly to therapy sessions, outreach, and care programs.'    },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5 shrink-0">{icon}</span>
                    <div>
                      <p className="font-semibold text-on-surface text-sm mb-1">{title}</p>
                      <p className="text-on-surface-variant text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}