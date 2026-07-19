import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-container py-20">
      <div className="max-w-container-max mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ldPm_mHg9ZUOsIVrVBOIRoLN9CGPgS4KpoW-U7f1FrdcbLvFIjSrqq71FXmYMFIhtMLoudtjlYLjHFkB3E4gdzMk4hsvOMUXTuTL165Y9ixuyF_GRuCHsb7wNIazvLBOpNXZAw6mTbMYXFj1hClXYVRw6D47YOpYvW3wTvCmV_SqvkZqcCjwIYQrN0iihxRZzA6eHXMPtEgGolAC6jQ1haW0eeay6ZhYag7sDvKTXLq5PQllESdSPVmlCtmxtEMjg70khjkz56g"
                alt="Niah Foundation Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="font-display text-xl font-bold text-primary">Niah Foundation</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Leading the charge for inclusive mental wellness and empowerment for special needs across Nigeria.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-xs font-semibold text-primary mb-6 uppercase tracking-widest">Navigation</h5>
            <ul className="space-y-4">
              {[['/', 'Home'], ['/about', 'About Us'], ['/events', 'Events'], ['/impact', 'Impact'], ['/team', 'The Team']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-on-surface-variant hover:text-secondary transition-colors text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-semibold text-primary mb-6 uppercase tracking-widest">Stay Updated</h5>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button className="bg-primary text-on-primary rounded-xl px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant text-center">
          <p className="text-on-surface-variant text-sm">
            © {new Date().getFullYear()} Niah Foundation. Dedicated to mental health and special needs in Nigeria.
          </p>
        </div>
      </div>
    </footer>
  )
}