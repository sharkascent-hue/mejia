import { useCallback, useEffect, useRef, useState } from 'react'
import YardScene from './YardScene'

export default function BeforeAfter() {
  const [pos, setPos] = useState(52)
  const [touched, setTouched] = useState(false)
  const frameRef = useRef(null)
  const draggingRef = useRef(false)

  const setFromClientX = useCallback((clientX) => {
    const el = frameRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    const next = ((clientX - left) / width) * 100
    setPos(Math.min(100, Math.max(0, next)))
  }, [])

  // Gentle nudge on load so the control announces itself as draggable.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf, start
    const tick = (t) => {
      if (draggingRef.current) return
      start ??= t
      const p = Math.min((t - start) / 2200, 1)
      setPos(52 + Math.sin(p * Math.PI * 2) * 13)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    const id = setTimeout(() => { raf = requestAnimationFrame(tick) }, 700)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const move = (e) => { if (draggingRef.current) setFromClientX(e.clientX) }
    const up = () => { draggingRef.current = false }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [setFromClientX])

  const start = (e) => {
    draggingRef.current = true
    setTouched(true)
    setFromClientX(e.clientX)
  }

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 3
    if (e.key === 'ArrowLeft') { setPos((p) => Math.max(0, p - step)); setTouched(true); e.preventDefault() }
    if (e.key === 'ArrowRight') { setPos((p) => Math.min(100, p + step)); setTouched(true); e.preventDefault() }
    if (e.key === 'Home') { setPos(0); e.preventDefault() }
    if (e.key === 'End') { setPos(100); e.preventDefault() }
  }

  return (
    <figure className="m-0">
      <div
        ref={frameRef}
        onPointerDown={start}
        className="grain relative aspect-[16/10] w-full cursor-ew-resize touch-none
                   overflow-hidden rounded-[28px] bg-sand shadow-[0_24px_70px_rgba(18,26,20,0.22)]
                   ring-1 ring-ink/10 select-none sm:aspect-[16/9]"
      >
        {/* After sits underneath; before is clipped away as the divider travels right */}
        <div className="absolute inset-0"><YardScene variant="after" /></div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <YardScene variant="before" />
        </div>

        <span className={`pointer-events-none absolute top-4 left-4 rounded-full bg-ink/75 px-3.5 py-1.5
                          text-[0.7rem] font-600 tracking-[0.18em] text-canvas uppercase backdrop-blur
                          transition-opacity duration-300 ${pos > 14 ? 'opacity-100' : 'opacity-0'}`}>
          Before
        </span>
        <span className={`pointer-events-none absolute top-4 right-4 rounded-full bg-forest/85 px-3.5 py-1.5
                          text-[0.7rem] font-600 tracking-[0.18em] text-canvas uppercase backdrop-blur
                          transition-opacity duration-300 ${pos < 86 ? 'opacity-100' : 'opacity-0'}`}>
          After
        </span>

        {/* Divider + handle */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-canvas/90 shadow-[0_0_18px_rgba(0,0,0,0.35)]"
             style={{ left: `${pos}%` }} />
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare the yard before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% before, ${100 - Math.round(pos)}% after`}
          onKeyDown={onKeyDown}
          onPointerDown={start}
          className="absolute top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center
                     rounded-full bg-canvas text-forest shadow-[0_6px_24px_rgba(0,0,0,0.3)]
                     ring-1 ring-ink/10 transition-transform hover:scale-105 active:scale-95 cursor-ew-resize"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
          </svg>
        </button>

        <span className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full
                          bg-ink/70 px-4 py-2 text-xs font-500 text-canvas backdrop-blur
                          transition-opacity duration-500 ${touched ? 'opacity-0' : 'opacity-100'}`}>
          Drag to see the transformation
        </span>
      </div>
      <figcaption className="mt-3 text-center text-sm text-ink/55">
        Real scope of work: full renovation — dethatch, regrade, sod, paver walkway and planting beds.
      </figcaption>
    </figure>
  )
}
