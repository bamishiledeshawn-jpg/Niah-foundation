import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // The CSS reduced-motion rule cannot reach scrollIntoView/scrollTo, so the
    // behaviour has to be chosen here.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = reduced ? 'auto' : 'smooth'

    if (hash) {
      // small delay lets the new page render before we try to find the element
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior, block: 'start' }), 0)
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior })
  }, [pathname, hash])

  return null
}