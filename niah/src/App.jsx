import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Team from './pages/Team'
import Volunteer from './pages/Volunteer'
import Impact from './pages/Impact'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public site — wrapped in shared Navbar + Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="team" element={<Team />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="impact" element={<Impact />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin dashboard — intentionally outside Layout (no Navbar/Footer) */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}