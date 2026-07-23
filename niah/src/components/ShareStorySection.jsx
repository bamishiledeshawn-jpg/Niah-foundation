import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const DURATION_OPTIONS = [
  'A few days/weeks',
  'A few months',
  'Over a year',
  'Not sure',
]

export default function ShareStorySection() {
  const [story, setStory]         = useState('')
  const [duration, setDuration]   = useState('')
  const [support, setSupport]     = useState('')
  const [pseudonym, setPseudonym] = useState('')
  const [finalNote, setFinalNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!story.trim() || !duration) {
      setError("Please share a bit about what you're going through and how long it's been.")
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch(`${API_URL}/api/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, duration, support, pseudonym, finalNote }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Something went wrong sending your story. Please try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="card-container-low p-12 text-center max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-primary text-5xl mb-4 block">favorite</span>
            <h2 className="font-display text-2xl font-bold text-on-surface mb-3">Thank you for trusting us.</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Your story has been received. Every week we choose one submission for a licensed
              therapist, trained mental health first aider, or peer supporter to respond to —
              anonymously, on our page. No pressure, no shame. Just honesty and healing.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-container-max mx-auto px-10">
        <div className="card-container-low p-8 md:p-12 max-w-2xl mx-auto">
          <span className="section-eyebrow">DEAR NF</span>
          <h2 className="section-title mb-3">Share your story or struggle, anonymously.</h2>
          <p className="section-body mb-8">
            This is a safe space to share something you've been going through mentally or
            emotionally. You don't have to give your name, and you won't be judged. Every week,
            we choose one submission and have a licensed therapist, trained mental health first
            aider, or peer supporter respond with care — posted anonymously as part of our
            ongoing mental health series.
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block font-semibold text-on-surface text-sm mb-2">
                What's something you've been struggling with mentally or emotionally? <span className="text-secondary">*</span>
              </label>
              <p className="text-on-surface-variant text-xs mb-2">Write as much or as little as you'd like — no judgment here.</p>
              <textarea
                value={story}
                onChange={e => setStory(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="Take your time..."
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface text-sm mb-3">
                How long have you been dealing with this? <span className="text-secondary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DURATION_OPTIONS.map(option => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                      duration === option
                        ? 'border-primary bg-primary-fixed/40 text-on-primary-fixed font-semibold'
                        : 'border-outline-variant/40 text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={option}
                      checked={duration === option}
                      onChange={e => setDuration(e.target.value)}
                      className="accent-primary"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface text-sm mb-2">
                What does support look like for you right now?
              </label>
              <p className="text-on-surface-variant text-xs mb-2">Optional — but it helps us give more useful advice.</p>
              <textarea
                value={support}
                onChange={e => setSupport(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface text-sm mb-2">
                Want to use a pseudonym or sign off with something?
              </label>
              <p className="text-on-surface-variant text-xs mb-2">
                e.g. "Confused Girl in Lagos", "Tired but Trying" — optional, just to personalize the response.
              </p>
              <input
                type="text"
                value={pseudonym}
                onChange={e => setPseudonym(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface text-sm mb-2">
                Any final thoughts or anything you want us to know?
              </label>
              <textarea
                value={finalNote}
                onChange={e => setFinalNote(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-outline-variant/40 bg-surface px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {error && (
              <p className="text-error text-sm">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary text-xs py-3 px-8 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'SENDING…' : 'SHARE ANONYMOUSLY'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}