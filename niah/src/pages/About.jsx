import { useState } from 'react'
import PageHero from '../components/PageHero'
import DonateStrip from '../components/DonateStrip'

const VALUES = [
  { icon: 'favorite',  title: 'Compassion',         body: 'We lead with empathy in every interaction, ensuring dignity and respect for all we serve.' },
  { icon: 'handshake', title: 'Community',           body: 'Lasting change is built together. We partner with families, clinicians, and local leaders.' },
  { icon: 'science',   title: 'Evidence-based Care', body: 'Our programs are grounded in clinical research and best practices from global mental health frameworks.' },
  { icon: 'lock_open', title: 'Access for All',      body: 'No one should be turned away due to financial barriers. We work to eliminate cost as an obstacle.' },
]

// TODO: swap these placeholder photos + captions for real ones per credential
const CREDENTIALS = [
  {
    tag: 'HR Consultant',
    photo: '/images/community-photo.jpg',
    caption: 'Years of HR consulting experience inform how Niah builds and supports its volunteer teams.',
  },
  {
    tag: 'Mental Health Advocate',
    photo: '/images/about-hero.jpg',
    caption: 'Advocating for accessible, stigma-free mental health care across underserved communities.',
  },
  {
    tag: 'Youth Leader',
    photo: '/images/story-photo.jpg',
    caption: 'Leading youth-focused programs that build life skills and long-term resilience.',
  },
  {
    tag: 'Volunteer',
    photo: '/images/team-photo.jpg',
    caption: 'Hands-on in the field alongside the Niah team at every outreach event.',
  },
]

function CredentialTag({ item, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${
          isOpen
            ? 'bg-primary text-on-primary shadow-lg shadow-primary/40'
            : 'bg-primary-fixed/50 text-on-primary-fixed hover:bg-primary-fixed/80 hover:shadow-md hover:shadow-primary/30'
        }`}
      >
        {item.tag}
      </button>

      {/* Popover */}
      <div
        className={`absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64
                    origin-bottom transition-all duration-300 ease-out
                    ${isOpen
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-90 translate-y-2 pointer-events-none'}`}
      >
        <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
          <img src={item.photo} alt={item.tag} className="w-full h-32 object-cover" />
          <p className="text-on-surface-variant text-xs leading-relaxed p-4">{item.caption}</p>
        </div>
        {/* Little pointer triangle */}
        <div className="w-3 h-3 bg-surface border-r border-b border-outline-variant/30 rotate-45 mx-auto -mt-1.5" />
      </div>
    </div>
  )
}

export default function About() {
  const [openTag, setOpenTag] = useState(null)

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

              {/* Credential tags — click to reveal photo + caption */}
              <div className="flex flex-wrap gap-3 pt-2">
                {CREDENTIALS.map(item => (
                  <CredentialTag
                    key={item.tag}
                    item={item}
                    isOpen={openTag === item.tag}
                    onToggle={() => setOpenTag(prev => (prev === item.tag ? null : item.tag))}
                  />
                ))}
              </div>
              <p className="text-on-surface-variant/60 text-xs pt-1">Tap a tag to see more.</p>
            </div>
          </div>
        </div>
      </section>

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
    </>
  )
}