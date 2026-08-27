import { useEffect, useRef, useState } from 'react'

/** Progress 0→1 of an element travelling through a pinned scroll range. */
export function useScrollProgress(ref) {
  const [p, setP] = useState(0)
  const raf = useRef(0)
  const last = useRef(-1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const read = () => {
      raf.current = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const next = Math.min(1, Math.max(0, -rect.top / travel))
      // Quantise so we only re-render on a visible change.
      const q = Math.round(next * 500) / 500
      if (q !== last.current) { last.current = q; setP(q) }
    }
    const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(read) }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])

  return p
}

export function useMedia(query) {
  const [match, setMatch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/** Local 0→1 progress across a sub-range of the master timeline. */
export const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)))
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)
export const lerp = (a, b, t) => a + (b - a) * t
