import PageHero from '../components/PageHero'
import ShareStorySection from '../components/ShareStorySection'

const METRICS = [
  { icon: 'groups', value: '3,200+', label: 'Lives directly impacted', color: 'text-primary' },
  { icon: 'child_care', value: '47', label: 'Children enrolled in therapy', color: 'text-secondary' },
  { icon: 'school', value: '18', label: 'Schools reached by our curriculum', color: 'text-tertiary' },
  { icon: 'location_city', value: '9', label: 'States with active programs', color: 'text-primary' },
  { icon: 'volunteer_activism', value: '120+', label: 'Trained volunteer facilitators', color: 'text-secondary' },
  { icon: 'handshake', value: '14', label: 'Partner organizations', color: 'text-tertiary' },
]

const STORIES = [
  {
    quote: "Before Niah, I didn't know what was happening to my son. The clinic gave us a diagnosis, a plan, and most importantly — hope.",
    name: 'Patience O.',
    location: 'Enugu',
    icon: 'format_quote',
  },
  {
    quote: "I was trained as a community facilitator through the Niah program. I've since helped 60 young people in my area access support.",
    name: 'Suleiman K.',
    location: 'Kano',
    icon: 'format_quote',
  },
  {
    quote: 'The therapy sessions changed everything for my daughter. She is in school now, participating, thriving.',
    name: 'Mrs. Adaora B.',
    location: 'Anambra',
    icon: 'format_quote',
  },
]

const PROGRAMS = [
  {
    title: 'Early Intervention Clinics',
    body: 'Free diagnostic and therapeutic services for children with developmental delays, autism spectrum conditions, and learning differences.',
    metric: '47 children enrolled',
    icon: 'child_care',
  },
  {
    title: 'Stigma-Free Schools',
    body: 'A structured curriculum delivered by trained facilitators in secondary schools, normalizing help-seeking and peer support.',
    metric: '18 schools across 6 states',
    icon: 'school',
  },
  {
    title: 'Community Mental Health Outreach',
    body: 'Mobile teams providing first-response mental health education, referrals, and support at markets, churches, and mosques.',
    metric: '3,200+ people reached',
    icon: 'campaign',
  },
]

export default function Impact() {
  return (
    <>
      <PageHero
        eyebrow="IMPACT"
        title="Every number is a person."
        subtitle="Our work is measured not in reports, but in lives restored, children empowered, and communities changed."
        imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpUBpJIE-TNn3ddrG8cEqN_QphDMDYm04UtF-FSD2T9Xt7hBNHktUCJksrB3CnFk4PqQpBF0nLzpn1YTvqyChfbON15_KcgM0y2S8PUGRmQF8q2-0cCRAvSOyEfkZuQqGpDC9ia3pQ6QmFVmEzOl5BpEih82ycH0cM5aFShRSwUEIDmYiA0V0_sz6d4YJAmJleBhKdi8EnYK3tLIwIHRWvTL2EEgJBBt_JE9p9rRozhvQoXJkMz_C4zW-vgRn-SK3aF3BkEQ21Us"
      />

      {/* Metrics grid */}
      <section className="py-20 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10">
          <div className="text-center mb-14">
            <span className="section-eyebrow">BY THE NUMBERS</span>
            <h2 className="section-title">Our reach to date.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {METRICS.map(({ icon, value, label, color }) => (
              <div key={label} className="card p-8">
                <span className={`material-symbols-outlined text-4xl mb-4 block ${color}`}>{icon}</span>
                <h3 className={`font-display text-4xl font-bold ${color} mb-2`}>{value}</h3>
                <p className="text-on-surface-variant text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12">
            <span className="section-eyebrow">OUR PROGRAMS</span>
            <h2 className="section-title">How we deliver change.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS.map(({ title, body, metric, icon }) => (
              <div key={title} className="card-container-low p-8 border-t-4 border-primary">
                <span className="material-symbols-outlined text-primary text-4xl mb-5 block">{icon}</span>
                <h3 className="font-display text-xl font-semibold text-on-surface mb-3">{title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{body}</p>
                <div className="bg-primary-fixed/40 text-on-primary-fixed rounded-full px-4 py-1 inline-block text-xs font-semibold">
                  {metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-20 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12 text-center">
            <span className="section-eyebrow">TESTIMONIALS</span>
            <h2 className="section-title">Voices from the field.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STORIES.map(({ quote, name, location }) => (
              <div key={name} className="card p-8 flex flex-col justify-between">
                <p className="text-on-surface text-base leading-relaxed italic mb-6">"{quote}"</p>
                <div>
                  <p className="font-semibold text-on-surface text-sm">{name}</p>
                  <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>{location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShareStorySection />
    </>
  )
}