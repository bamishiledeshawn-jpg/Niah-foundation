import { Link } from 'react-router-dom'

export default function DonateStrip() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-container-max mx-auto px-10">
        <div className="glass-card p-12 rounded-[2rem] text-on-surface relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: 120 }}>favorite</span>
          </div>
          <div className="max-w-xl">
            <h2 className="font-display text-4xl font-bold mb-4">Ready to make a difference?</h2>
            <p className="text-on-surface-variant text-lg mb-8">
              Your support funds therapy sessions, outreach programs, and resources for Nigerians who need it most.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#donate" className="btn-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-base">favorite</span>
                DONATE NOW
              </Link>
              <Link to="/volunteer" className="btn-secondary">VOLUNTEER</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}