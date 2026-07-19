import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'The Team' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/impact', label: 'Impact' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-surface/90 backdrop-blur-md fixed w-full top-0 z-50 border-b border-outline-variant/20">
      <nav className="flex justify-between items-center max-w-container-max mx-auto px-10 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ldPm_mHg9ZUOsIVrVBOIRoLN9CGPgS4KpoW-U7f1FrdcbLvFIjSrqq71FXmYMFIhtMLoudtjlYLjHFkB3E4gdzMk4hsvOMUXTuTL165Y9ixuyF_GRuCHsb7wNIazvLBOpNXZAw6mTbMYXFj1hClXYVRw6D47YOpYvW3wTvCmV_SqvkZqcCjwIYQrN0iihxRZzA6eHXMPtEgGolAC6jQ1haW0eeay6ZhYag7sDvKTXLq5PQllESdSPVmlCtmxtEMjg70khjkz56g"
            alt="Niah Foundation Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-display text-xl font-bold text-primary">Niah Foundation</span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-semibold border-b-2 border-primary pb-1 text-sm'
                  : 'text-on-surface-variant hover:text-primary transition-colors text-sm'
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-4">
          <NavLink to="/contact#donate" className="btn-donate hidden sm:inline-flex">
            DONATE
          </NavLink>
          <button
            className="md:hidden text-primary"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-surface border-t border-outline-variant/20 px-6 pb-6 pt-4 space-y-4">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact#donate" onClick={() => setOpen(false)} className="btn-donate inline-flex mt-2">
            DONATE
          </NavLink>
        </div>
      )}
    </header>
  )
}