import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BackgroundDecorations from './BackgroundDecorations'

export default function Layout() {
  return (
    <div style={{ position: 'relative' }}>
      <BackgroundDecorations />
      <Navbar />
      <main className="pt-20" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer style={{ position: 'relative', zIndex: 1 }} />
    </div>
  )
}