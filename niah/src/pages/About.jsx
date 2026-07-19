import PageHero from '../components/PageHero'
import DonateStrip from '../components/DonateStrip'

const VALUES = [
  { icon: 'favorite',  title: 'Compassion',         body: 'We lead with empathy in every interaction, ensuring dignity and respect for all we serve.' },
  { icon: 'handshake', title: 'Community',           body: 'Lasting change is built together. We partner with families, clinicians, and local leaders.' },
  { icon: 'science',   title: 'Evidence-based Care', body: 'Our programs are grounded in clinical research and best practices from global mental health frameworks.' },
  { icon: 'lock_open', title: 'Access for All',      body: 'No one should be turned away due to financial barriers. We work to eliminate cost as an obstacle.' },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT US"
        title="Who we are and why we exist."
        subtitle="Niah Foundation was born from a recognition of the silent crisis of mental health in Nigeria and a determination to act."
        imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpUBpJIE-TNn3ddrG8cEqN_QphDMDYm04UtF-FSD2T9Xt7hBNHktUCJksrB3CnFk4PqQpBF0nLzpn1YTvqyChfbON15_KcgM0y2S8PUGRmQF8q2-0cCRAvSOyEfkZuQqGpDC9ia3pQ6QmFVmEzOl5BpEih82ycH0cM5aFShRSwUEIDmYiA0V0_sz6d4YJAmJleBhKdi8EnYK3tLIwIHRWvTL2EEgJBBt_JE9p9rRozhvQoXJkMz_C4zW-vgRn-SK3aF3BkEQ21Us"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCE_QyD64kTKyrEkld8Si6Y8MdJ73tF0tthNW4XrulJtecH5VUMbmGzKjHoqFLWur-BvnWoHJjuJMafx2lavSIFAH6T9hxWbkdy2d8wm9Ro19jhqodfLdlq6zFxdupe_61Fwb-DX95b7wlutcDsBSW6whZDG2Zcx12_xSr0undTFs42F6LhDc-epm_SW06XvWCpe_IZbvv3ozPIJUgAoxxPJ3aMl3Lins9Dpf_-BPnW3qury4RXJ8ZtUYROj4tuwPtWy8dcXkojHo"
                alt="Foundation work in progress"
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

            {/* Portrait placeholder */}
            <div className="relative mx-auto mb-10 w-64 h-80 md:w-80 md:h-96">
              <div className="organic-shape bg-primary-fixed/30 absolute inset-0" />
              <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl bg-surface-container-high flex flex-col items-center justify-end">
                {/* Silhouette placeholder */}
                <svg
                  viewBox="0 0 200 260"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-cover"
                  style={{ background: 'linear-gradient(160deg, #cceacf 0%, #8daa91 100%)' }}
                >
                  {/* Head */}
                  <circle cx="100" cy="85" r="38" fill="rgba(255,255,255,0.25)" />
                  {/* Shoulders / body */}
                  <ellipse cx="100" cy="200" rx="72" ry="70" fill="rgba(255,255,255,0.18)" />
                </svg>
                {/* Placeholder label */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-surface/80 backdrop-blur-sm text-on-surface-variant text-xs font-semibold px-4 py-1.5 rounded-full">
                    Photo coming soon
                  </span>
                </div>
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

              {/* Credential tags */}
              <div className="flex flex-wrap gap-3 pt-2">
                {['HR Consultant', 'Mental Health Advocate', 'Youth Leader', 'Volunteer'].map(tag => (
                  <span
                    key={tag}
                    className="bg-primary-fixed/50 text-on-primary-fixed text-xs font-semibold px-4 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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