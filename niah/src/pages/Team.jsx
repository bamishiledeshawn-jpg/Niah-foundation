import PageHero from '../components/PageHero'
import DonateStrip from '../components/DonateStrip'

const TEAM = [
  {
    name: 'Dr. Adaeze Okonkwo',
    role: 'Founder & Executive Director',
    bio: 'Psychiatrist with 15+ years in community mental health. Previously led the WHO Nigeria mental health initiative.',
    initials: 'AO',
    accent: 'bg-primary-fixed text-on-primary-fixed',
  },
  {
    name: 'Emeka Nwachukwu',
    role: 'Director of Programs',
    bio: 'Public health specialist focused on scaling evidence-based interventions in low-resource settings across West Africa.',
    initials: 'EN',
    accent: 'bg-secondary-fixed text-on-secondary-container',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'Head of Special Needs Services',
    bio: 'Certified occupational therapist and autism specialist with a decade of experience in early childhood intervention.',
    initials: 'FA',
    accent: 'bg-tertiary-fixed text-on-tertiary-container',
  },
  {
    name: 'Chukwuemeka Eze',
    role: 'Community Engagement Lead',
    bio: 'Former youth worker who built grassroots networks across 12 states, connecting communities to mental health resources.',
    initials: 'CE',
    accent: 'bg-primary-fixed text-on-primary-fixed',
  },
  {
    name: 'Dr. Ngozi Adeyemi',
    role: 'Clinical Psychologist',
    bio: 'Specializes in trauma-informed care and group therapy. Supervises volunteer clinical staff and manages pro-bono partnerships.',
    initials: 'NA',
    accent: 'bg-secondary-fixed text-on-secondary-container',
  },
  {
    name: 'Taiwo Oladele',
    role: 'Communications & Partnerships',
    bio: 'Builds the coalitions and narratives that help Niah\'s work reach national policy conversations and potential funders.',
    initials: 'TO',
    accent: 'bg-tertiary-fixed text-on-tertiary-container',
  },
]

const BOARD = [
  { name: 'Prof. Bola Akindele', role: 'Board Chair — University of Lagos, Neuroscience' },
  { name: 'Mrs. Kemi Fashola', role: 'Treasurer — Finance & Social Impact' },
  { name: 'Mr. Tobi Adesanya', role: 'Legal Counsel — Human Rights Law' },
]

export default function Team() {
  return (
    <>
      <PageHero
        eyebrow="THE TEAM"
        title="The people behind the mission."
        subtitle="Clinicians, community builders, and advocates united by a single purpose: mental health for every Nigerian."
        imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpUBpJIE-TNn3ddrG8cEqN_QphDMDYm04UtF-FSD2T9Xt7hBNHktUCJksrB3CnFk4PqQpBF0nLzpn1YTvqyChfbON15_KcgM0y2S8PUGRmQF8q2-0cCRAvSOyEfkZuQqGpDC9ia3pQ6QmFVmEzOl5BpEih82ycH0cM5aFShRSwUEIDmYiA0V0_sz6d4YJAmJleBhKdi8EnYK3tLIwIHRWvTL2EEgJBBt_JE9p9rRozhvQoXJkMz_C4zW-vgRn-SK3aF3BkEQ21Us"
      />

      {/* Core team */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12">
            <span className="section-eyebrow">CORE STAFF</span>
            <h2 className="section-title">Meet the team.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map(({ name, role, bio, initials, accent }) => (
              <div key={name} className="card p-8">
                <div className={`w-16 h-16 rounded-full ${accent} flex items-center justify-center font-display text-xl font-bold mb-6`}>
                  {initials}
                </div>
                <h3 className="font-display text-lg font-semibold text-on-surface mb-1">{name}</h3>
                <p className="text-xs font-semibold text-primary tracking-wide uppercase mb-4">{role}</p>
                <p className="text-on-surface-variant text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="py-20 bg-surface-container">
        <div className="max-w-container-max mx-auto px-10">
          <div className="mb-12">
            <span className="section-eyebrow">GOVERNANCE</span>
            <h2 className="section-title">Board of Directors.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOARD.map(({ name, role }) => (
              <div key={name} className="card p-8 flex items-start gap-5">
                <span className="material-symbols-outlined text-primary text-3xl mt-1">account_circle</span>
                <div>
                  <h4 className="font-display text-base font-semibold text-on-surface mb-1">{name}</h4>
                  <p className="text-on-surface-variant text-sm">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonateStrip />
    </>
  )
}
