import { Link } from 'react-router-dom'
import DonateStrip from '../components/DonateStrip'

const STATS = [
  {
    icon: 'groups',
    value: '1 in 5',
    label: 'Nigerians experience mental health challenges yearly.',
    color: 'text-primary',
  },
  {
    icon: 'child_care',
    value: '40+',
    label: 'Children with special needs empowered through therapy.',
    color: 'text-secondary',
  },
  {
    icon: 'volunteer_activism',
    value: '3,000+',
    label: 'Lives impacted across multiple Nigerian communities.',
    color: 'text-tertiary',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover object-[center_57.56%]"
            src="/images/hero-outreach.jpg"
            alt="Niah Foundation team at community outreach event"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-10 w-full">
          <div className="max-w-2xl">
            <span className="section-eyebrow">OUR MISSION</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
              Empowering communities through compassion and action.
            </h1>
            <p className="text-on-surface-variant text-lg mb-10 max-w-lg leading-relaxed">
              Restoring hope and providing specialized care for Nigerians living with mental health challenges
              and special needs. We believe in a world where everyone belongs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/volunteer" className="btn-primary flex items-center gap-2">
                GET INVOLVED <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link to="/about" className="btn-secondary">LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-surface-container py-20 relative overflow-hidden">
        <svg className="absolute z-0" style={{ left: '6%', top: '12%' }} width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#f7d08a' : '#fce0a8'} transform={`rotate(${(i * 360) / 5 + 20} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#f7d08a" opacity={0.5} />
        </svg>
        <svg className="absolute z-0" style={{ left: '92%', top: '20%' }} width="30" height="30" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#c3aed6' : '#d4c4e8'} transform={`rotate(${(i * 360) / 5 + 60} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#c3aed6" opacity={0.5} />
        </svg>
        <svg className="absolute z-0" style={{ left: '48%', top: '85%' }} width="50" height="50" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#f9a8c9' : '#f4c2d4'} transform={`rotate(${(i * 360) / 5 + 100} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#f9a8c9" opacity={0.5} />
        </svg>
        <svg className="absolute z-0" style={{ left: '18%', top: '78%' }} width="26" height="26" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#a8d8ea' : '#c4e8f4'} transform={`rotate(${(i * 360) / 5 + 140} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#a8d8ea" opacity={0.5} />
        </svg>
        <div className="max-w-container-max mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {STATS.map(({ icon, value, label, color }) => (
              <div key={value} className="card p-10">
                <div className={`${color} mb-4 flex justify-center`}>
                  <span className="material-symbols-outlined text-5xl">{icon}</span>
                </div>
                <h2 className={`font-display text-5xl font-bold ${color} mb-2`}>{value}</h2>
                <p className="text-on-surface-variant text-base">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision & Objectives */}
      <section className="py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative py-6">
                <div className="organic-shape bg-primary-fixed/30 absolute inset-0 -rotate-6" />
                <svg className="absolute -bottom-6 -left-6 z-[1]" width="70" height="70" viewBox="0 0 100 100" aria-hidden="true">
                  {[0,1,2,3,4].map((i) => (
                    <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#f9a8c9' : '#f4c2d4'} transform={`rotate(${(i * 360) / 5} 50 50)`} />
                  ))}
                  <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} />
                  <circle cx={50} cy={50} r={7} fill="#f9a8c9" opacity={0.5} />
                </svg>
                <svg className="absolute -top-5 -right-5 z-[1]" width="50" height="50" viewBox="0 0 100 100" aria-hidden="true">
                  {[0,1,2,3,4].map((i) => (
                    <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#a8d8ea' : '#c4e8f4'} transform={`rotate(${(i * 360) / 5} 50 50)`} />
                  ))}
                  <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} />
                  <circle cx={50} cy={50} r={7} fill="#a8d8ea" opacity={0.5} />
                </svg>
                <img
                  className="relative z-10 w-full h-[420px] object-cover rounded-[40px] shadow-2xl"
                  src="/images/community-photo.jpg"
                  alt="Niah Foundation community outreach"
                />
              </div>
              <div className="space-y-8">
                <div className="card-container-low p-8 border-l-4 border-primary">
                  <h3 className="font-display text-2xl text-primary mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined">visibility</span> Our Vision
                  </h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed">
                    To create an inclusive society where mental health is prioritized, and every individual with
                    special needs is empowered to reach their full potential without stigma.
                  </p>
                </div>

                <div className="card-container-low p-8 border-l-4 border-secondary">
                  <h3 className="font-display text-2xl text-secondary mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined">target</span> Our Mission
                  </h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed">
                    We are dedicated to providing accessible mental health resources, early intervention for
                    children with special needs, and fostering community support through sustainable action.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-container-low p-8 border-l-4 border-tertiary">
              <h3 className="font-display text-2xl text-tertiary mb-5 flex items-center gap-3">
                <span className="material-symbols-outlined">flag</span> Objectives
              </h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Raise awareness of mental health in underrepresented communities.',
                  'Champion the inclusion of special needs individuals.',
                  'Build collaborative systems of care and support.',
                ].map((obj) => (
                  <li key={obj} className="flex items-start gap-3 text-on-surface-variant text-base leading-relaxed">
                    <span className="material-symbols-outlined text-tertiary text-base mt-0.5 shrink-0">check_circle</span>
                    {obj}
                  </li>
                ))}
              </ul>
              <div className="bg-tertiary-fixed/30 rounded-2xl px-5 py-4">
                <p className="text-on-surface text-sm leading-relaxed">
                  <span className="font-semibold text-tertiary">Did you know?</span>{' '}
                  The Niah Foundation has benefited over 1,000 people, transforming lives across Nigeria,
                  supporting over 300 women — including widows and survivors of domestic violence — through
                  mental health resources, food donation drives, and empowerment programs.
                </p>
              </div>
              <Link to="/events" className="btn-secondary inline-flex items-center gap-2 mt-6 w-fit">
                SEE MORE <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Meet the Team */}
      <section className="py-20 bg-surface-container relative overflow-hidden">
        <svg className="absolute z-0" style={{ left: '88%', top: '10%' }} width="36" height="36" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#8daa91' : '#a8c4ac'} transform={`rotate(${(i * 360) / 5 + 30} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#8daa91" opacity={0.5} />
        </svg>
        <svg className="absolute z-0" style={{ left: '4%', top: '85%' }} width="44" height="44" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#e8c4b8' : '#f0d4cc'} transform={`rotate(${(i * 360) / 5 + 80} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#e8c4b8" opacity={0.5} />
        </svg>
        <svg className="absolute z-0" style={{ left: '55%', top: '6%' }} width="24" height="24" viewBox="0 0 100 100" aria-hidden="true">
          {[0,1,2,3,4].map((i) => <ellipse key={i} cx={50} cy={28} rx={12} ry={24} fill={i % 2 === 0 ? '#f4a261' : '#f7bc8a'} transform={`rotate(${(i * 360) / 5 + 160} 50 50)`} />)}
          <circle cx={50} cy={50} r={12} fill="#fff" opacity={0.9} /><circle cx={50} cy={50} r={7} fill="#f4a261" opacity={0.5} />
        </svg>
        <div className="max-w-container-max mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative order-2 lg:order-1">
              <div className="organic-shape bg-secondary-fixed/30 absolute inset-0 rotate-3" />
              <img
                className="relative z-10 w-full h-[500px] object-cover object-top rounded-[40px] shadow-2xl"
                src="/images/team-photo.jpg"
                alt="Niah Foundation volunteer team"
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="section-eyebrow">MEET THE TEAM</span>
              <h2 className="font-display text-4xl font-bold text-on-surface mt-2 mb-6 leading-tight">
                The passionate individuals driving change.
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                Our diverse team is dedicated to promoting mental health awareness, inclusion, and holistic
                well-being across Africa. With expertise spanning advocacy, education, and community outreach,
                we strive to create a sustainable impact. Together, we address pressing needs, empower
                marginalised groups, and champion the integration of mental health into everyday life.
              </p>
              <Link to="/team" className="btn-primary flex items-center gap-2 w-fit">
                LEARN MORE <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-container-max mx-auto px-10">
          <div className="glass-card p-12 rounded-[2rem] text-on-surface relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined" style={{ fontSize: 120 }}>favorite</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">Support Our Cause</h2>
                <p className="text-on-surface-variant text-lg mb-8">
                  Your financial contribution directly funds therapy sessions, medication, and outreach programs
                  for those who need it most.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact" className="btn-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">favorite</span>
                    DONATE NOW
                  </Link>
                  <Link to="/contact#contact-form" className="btn-secondary">PARTNER WITH US</Link>
                </div>
              </div>
              <div className="bg-surface-container-highest p-8 rounded-2xl border border-outline-variant space-y-5">
                {[
                  { icon: 'verified',     color: 'text-primary',   title: 'Secured by Paystack',      body: "All transactions are encrypted and processed through Nigeria's leading payment gateway." },
                  { icon: 'receipt_long', color: 'text-secondary', title: 'Instant confirmation',      body: "You'll receive an email receipt immediately after your donation is processed."           },
                  { icon: 'favorite',     color: 'text-tertiary',  title: '100% goes to the mission', body: 'Every naira funds therapy sessions, outreach programs, and care for those in need.'      },
                ].map(({ icon, color, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <span className={`material-symbols-outlined text-3xl mt-1 ${color}`}>{icon}</span>
                    <div>
                      <p className="font-semibold text-on-surface text-sm mb-1">{title}</p>
                      <p className="text-on-surface-variant text-sm">{body}</p>
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