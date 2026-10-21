import { useState } from 'react'
import { usePaystack } from '../hooks/usePaystack'

// Preset donation amounts in Naira — stored as kobo (×100) when sent to Paystack.
const PRESETS = [500, 1000, 2500, 5000, 10000]

// <DonateButton /> — self-contained donate flow.
// Drop anywhere on the site. Renders a button that opens the Paystack popup.
// Props:
//   label      — button text (default "DONATE")
//   className  — extra Tailwind classes (default uses btn-primary)
export default function DonateButton({ label = 'DONATE', className }) {
  const [email,      setEmail]      = useState('')
  const [amount,     setAmount]     = useState(1000)
  const [custom,     setCustom]     = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [status,     setStatus]     = useState('idle') // idle | loading | success | error
  const [message,    setMessage]    = useState('')

  const openPaystack = usePaystack()

  function resolvedAmount() {
    const c = parseInt(custom, 10)
    return (!isNaN(c) && c > 0) ? c : amount
  }

  function handlePay() {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setMessage('')

    openPaystack({
      email,
      amountInKobo: resolvedAmount() * 100,
      metadata: { source: 'niah-website' },
      onSuccess: ({ verified, payment, error }) => {
        setShowModal(false)
        if (verified) {
          setStatus('success')
          setMessage(`Thank you! ₦${(payment.amount / 100).toLocaleString()} received.`)
        } else {
          setStatus('error')
          setMessage(error ?? 'Payment could not be verified. Please contact us.')
        }
      },
      onClose: () => {
        setStatus('idle')
      },
    })
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setShowModal(true); setStatus('idle'); setMessage('') }}
        className={className ?? 'btn-primary'}
      >
        {label}
      </button>

      {/* Inline feedback below the button */}
      {status === 'success' && (
        <p className="mt-3 text-sm text-primary font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          {message}
        </p>
      )}
      {status === 'error' && !showModal && (
        <p className="mt-3 text-sm text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {message}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Card */}
          <div className="relative bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl p-8 w-full max-w-md">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Make a donation</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Your gift directly funds therapy sessions and outreach programs across Nigeria.
            </p>

            {/* Email */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Amount presets */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide block mb-3">
                Amount (₦)
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => { setAmount(p); setCustom('') }}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      amount === p && !custom
                        ? 'bg-primary text-on-primary border-primary'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {p >= 1000 ? `${p/1000}k` : p}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={custom}
                onChange={e => { setCustom(e.target.value); setAmount(0) }}
                placeholder="Custom amount"
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Summary */}
            <div className="bg-surface-container rounded-xl px-4 py-3 mb-5 flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">You're donating</span>
              <span className="font-display text-xl font-bold text-primary">
                ₦{resolvedAmount().toLocaleString()}
              </span>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-base shrink-0">error</span>
                {message}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={status === 'loading'}
              className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  OPENING PAYSTACK…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">favorite</span>
                  DONATE ₦{resolvedAmount().toLocaleString()}
                </>
              )}
            </button>

            <p className="text-xs text-on-surface-variant text-center mt-4">
              Secured by Paystack. Your card details never touch our server.
            </p>
          </div>
        </div>
      )}
    </>
  )
}