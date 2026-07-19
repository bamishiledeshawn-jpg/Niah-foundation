import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // small delay lets the new page render before we try to find the element
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return null
}