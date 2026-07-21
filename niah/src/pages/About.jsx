import { useState, useEffect, useRef } from 'react'
import PageHero from '../components/PageHero'
import DonateStrip from '../components/DonateStrip'

const VALUES = [
  { icon: 'favorite',  title: 'Compassion',         body: 'We lead with empathy in every interaction, ensuring dignity and respect for all we serve.' },
  { icon: 'handshake', title: 'Community',           body: 'Lasting change is built together. We partner with families, clinicians, and local leaders.' },
  { icon: 'science',   title: 'Evidence-based Care', body: 'Our programs are grounded in clinical research and best practices from global mental health frameworks.' },
  { icon: 'lock_open', title: 'Access for All',      body: 'No one should be turned away due to financial barriers. We work to eliminate cost as an obstacle.' },
]

// TODO: swap these placeholder video paths + captions for real short clips per credential
// Drop .mp4 files into niah/public/videos/ and update the `video` field below.
const CREDENTIALS = [
  {
    tag: 'HR Consultant',
    video: '/videos/hr-consultant.mp4',
    poster: '/images/community-photo.jpg',
    caption: 'Years of HR consulting experience inform how Niah builds and supports its volunteer teams.',
  },
  {
    tag: 'Mental Health Advocate',
    video: '/videos/mental-health-advocate.mp4',
    poster: '/images/about-hero.jpg',
    caption: 'Advocating for accessible, stigma-free mental health care across underserved communities.',
  },
  {
    tag: 'Youth Leader',
    video: '/videos/youth-leader.mp4',
    poster: '/images/story-photo.jpg',
    caption: 'Leading youth-focused programs that build life skills and long-term resilience.',
  },
  {
    tag: 'Volunteer',
    video: '/videos/volunteer.mp4',
    poster: '/images/team-photo.jpg',
    caption: 'Hands-on in the field alongside the Niah team at every outreach event.',
  },
]

function CredentialTag({ item, isSource, isGlowing, buttonRef, onOpen }) {
  return (
    <button
      ref={buttonRef}
      onClick={() => onOpen(item)}
      className={`relative text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 ${
        isSource
          ? 'opacity-0'
          : 'bg-primary-fixed/50 text-on-primary-fixed hover:bg-primary-fixed/80 hover:shadow-lg hover:shadow-primary/40'
      }`}
    >
      {/* Pulsing glow ring — nudges attention when section enters view, like a "subscribe" cue */}
      {isGlowing && !isSource && (
        <span className="absolute inset-0 rounded-full animate-ping-slow bg-primary/50 -z-10" />
      )}
      {item.tag}
    </button>
  )
}

// Morphs from the clicked tag's exact position/size into a centered detail card.
// Sits below the navbar (z-40 vs navbar's z-50) with top padding, so it never
// visually touches or overlaps the header.
function MorphCard({ item, startRect, onClose }) {
  const [phase, setPhase] = useState('start') // 'start' -> 'end'
  const NAV_GAP = 96 // px reserved below the fixed navbar

  const finalStyle = {
    top: `calc(${NAV_GAP}px + (100vh - ${NAV_GAP}px) / 2)`,
    left: '50%',
    width: 'min(560px, 92vw)',
    height: `min(560px, calc(90vh - ${NAV_GAP}px))`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '2rem',
  }
  const startStyle = startRect ? {
    top: startRect.top, left: startRect.left,
    width: startRect.width, height: startRect.height,
    transform: 'translate(0, 0)',
    borderRadius: '9999px',
  } : finalStyle

  useEffect(() => {
    const id = requestAnimationFrame(() => setPhase('end'))
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => { cancelAnimationFrame(id); window.removeEventListener('keydown', onKey) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClose() {
    setPhase('start')
    setTimeout(onClose, 350)
  }

  const style = phase === 'end' ? finalStyle : startStyle

  return (
    <div className="fixed inset-0 z-40" style={{ top: NAV_GAP }}>
      <div
        className={`absolute inset-0 bg-on-surface/60 backdrop-blur-sm transition-opacity duration-300 ${
          phase === 'end' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: -NAV_GAP }}
        onClick={handleClose}
      />
      <div
        className="fixed bg-surface shadow-2xl overflow-hidden transition-all duration-[450ms]"
        style={{ ...style, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div
          className={`h-full flex flex-col transition-opacity duration-200 ${
            phase === 'end' ? 'opacity-100 delay-[250ms]' : 'opacity-0'
          }`}
        >
          <div className="relative shrink-0">
            <video
              src={item.video}
              poster={item.poster}
              className="w-full h-64 object-cover bg-on-surface/10"
              autoPlay
              loop
              muted
              playsInline
            />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm rounded-full p-2
                         text-on-surface hover:text-primary transition-colors shadow-md"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-xl block">close</span>
            </button>
          </div>
          <div className="p-8 overflow-y-auto">
            <span className="section-eyebrow mb-3 inline-block">{item.tag}</span>
            <p className="text-on-surface-variant text-base leading-relaxed">{item.caption}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const [active, setActive]       = useState(null)
  const [startRect, setStartRect] = useState(null)
  const [glowing, setGlowing]     = useState(false)
  const btnRefs   = useRef({})
  const sectionRef = useRef(null)

  // Scroll-triggered attention cue — pulses the tags a few times once the
  // section enters view, works identically on mobile scroll and desktop.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGlowing(true)
          const timer = setTimeout(() => setGlowing(false), 2400) // ~3 pulses then rest
          observer.disconnect()
          return () => clearTimeout(timer)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleOpen(item) {
    const el = btnRefs.current[item.tag]
    if (el) setStartRect(el.getBoundingClientRect())
    setActive(item)
  }

  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="Who we are and why we exist."
        subtitle="Niah Foundation was born from a recognition of the silent crisis of mental health in Nigeria and a determination to act."
        imgSrc="/images/about-hero.jpg"
      />

      {/* Story */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-eyebrow">OUR STORY</span>
              <h2 className="section-title mb-6">From one family's experience to a national movement.</h2>
              <div className="space-y-5 section-body">
                <p>
                  Niah Foundation was established after our founder witnessed firsthand the lack of accessible,
                  stigma-free support for a family member navigating severe depression in Lagos. What should
                  have been a manageable situation became a crisis — not for lack of love, but for lack of
                  resources, trained professionals, and community understanding.
                </p>
                <p>
                  That experience revealed a systemic gap. Nigeria has fewer than 300 practicing psychiatrists
                  for over 200 million people. Awareness is low, stigma is high, and the care infrastructure
                  that exists is concentrated in Lagos and Abuja, leaving millions underserved.
                </p>
                <p>
                  Niah was founded to bridge that gap — not through charity alone, but through sustainable,
                  community-rooted action that builds capacity where it's needed most.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="organic-shape bg-secondary-fixed/40 absolute inset-0 rotate-6" />
              <img
                className="relative z-10 w-full h-[460px] object-cover rounded-[40px] shadow-2xl"
                src="/images/story-photo.jpg"
                alt="Niah Foundation team at community event"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Founder */}
      <section className="py-20 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-eyebrow">THE FOUNDER</span>
            <h2 className="section-title mb-12">Meet Chenaniah Bamishile.</h2>

            {/* Portrait */}
            <div className="relative mx-auto mb-10 w-64 h-80 md:w-80 md:h-96">
              <div className="organic-shape bg-primary-fixed/30 absolute inset-0" />
              <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl">
                <img
                  src="/images/founder.jpg"
                  alt="Chenaniah Bamishile, Founder & Executive Director"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="text-left card-container-low p-8 md:p-10 rounded-3xl border-l-4 border-primary space-y-4">
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Niah Foundation was founded by <span className="font-semibold text-on-surface">Chenaniah Bamishile</span>,
                a passionate mental health advocate dedicated to creating lasting change. Under her leadership,
                the foundation combines addressing immediate needs with spreading mental health awareness.
                Programs range from school renovations and food distribution to educating girls on mental health
                and empowering them with life skills.
              </p>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Chenaniah's vision drives Niah Foundation's mission to foster inclusion and awareness. Her
                commitment to kindness, alongside her extensive experience as an HR consultant, volunteer, and
                youth leader, ensures that the foundation remains at the forefront of mental health advocacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credential tags — separated from bio, its own moment */}
      <section ref={sectionRef} className="py-16 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10 text-center">
          <span className="section-eyebrow">HER BACKGROUND</span>
          <h3 className="font-display text-2xl font-bold text-on-surface mt-2 mb-8">
            Tap to see her impact, up close.
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {CREDENTIALS.map(item => (
              <CredentialTag
                key={item.tag}
                item={item}
                isSource={active?.tag === item.tag}
                isGlowing={glowing}
                buttonRef={el => { btnRefs.current[item.tag] = el }}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </div>
      </section>

      {active && (
        <MorphCard
          item={active}
          startRect={startRect}
          onClose={() => setActive(null)}
        />
      )}

      {/* Values */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="text-center mb-14">
            <span className="section-eyebrow">WHAT DRIVES US</span>
            <h2 className="section-title">Our core values.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} className="card p-8">
                <span className="material-symbols-outlined text-primary text-4xl mb-5 block">{icon}</span>
                <h3 className="font-display text-xl font-semibold text-on-surface mb-3">{title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonateStrip />

      <style>{`
        @keyframes pingSlow {
          0%   { transform: scale(1);    opacity: 0.6; }
          70%  { transform: scale(1.35); opacity: 0;   }
          100% { transform: scale(1.35); opacity: 0;   }
        }
        .animate-ping-slow {
          animation: pingSlow 1.2s cubic-bezier(0,0,0.2,1) 2;
        }
      `}</style>
    </>
  )
}