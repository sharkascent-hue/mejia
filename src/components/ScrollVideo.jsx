import { useEffect, useRef, useState } from 'react'
import { useScrollProgress, useMedia } from '../lib/scroll'
import HeroOverlay from './HeroOverlay'

const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Ecce44mke0LAFhuakx5m04bD91'

/* Short-keyframe-interval encodes (480p-class, ~430-520 kB) so any frame can be
   decoded from at most 4 frames back. Local files in public/video win when
   present. The originals were 2.5K and 10-12 MB, which is what made phones
   stall. A 24px blur-up is inlined so the hero paints before any network. */
const PORTRAIT = {
  sources: ['/video/fence-build-portrait.mp4', `${CDN}/f5fbc824-c8c9-44f4-9447-fc67e85e7186.mp4`],
  blur: 'data:image/jpeg;base64,/9j//gAQTGF2YzU5LjM3LjEwMAD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABzAAACAwEBAAAAAAAAAAAAAAAEBQMBAgYHAQADAQEBAAAAAAAAAAAAAAABBQIEAwYQAAEDAgMHBQEAAAAAAAAAAAEAAhESA1ExQZEjIiHREwSxknEU4VIRAAICAgMBAAAAAAAAAAAAAAABAhGhEjETYQP/wAARCAAqABgDASIAAhEAAxEA/9oADAMBAAIRAxEAPwDqS1ZDU84CJqbtCqhP9xVTAWtRNK5+55jbbqGiSDBJ5BR/dODdv6l0vtFPnBpUWLa7dTR3JYDUQRrhlzTS75pIaWOExxAgx8zErz91yrP06Iepea7JPw0WE7youJtmTJknpqie47+LXvelZcqlc7YNmBOI0UQOKhGa0ciqJN1SUTKUNU6ID//Z',
}
const LANDSCAPE = {
  sources: ['/video/fence-build.mp4', `${CDN}/0fddad46-c769-40bb-8d19-29523d1cbafa.mp4`],
  blur: 'data:image/jpeg;base64,/9j//gAQTGF2YzU5LjM3LjEwMAD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABqAAEBAQEBAQAAAAAAAAAAAAAEBQYBAAMBAQEBAQAAAAAAAAAAAAAAAAQCAAMQAAEEAAUEAwEBAAAAAAAAAAEAAgMRElFBBDFhcSIhoZHRBUIRAAIDAQEAAAAAAAAAAAAAAAABEyExEQL/wAARCAASACADASIAAhEAAxEA/9oADAMBAAIRAxEAPwC0dw7wa0eWpfarzFsTHOsGhxwTfRYY7qn48ADqq7OVKZJMJaxNaaFcafaNPzLOLXk1cW/ZiAe2icjdBC/oyskax8ZsewR7u+vTssYREf8AI+f1fMxsIr2B3KNK3pVHnE5oaU7lEQVhB0apYQxqlhZmP//Z',
}

const CAPTIONS = [
  [0.00, 'The garden as it is', 'Open boundary, nothing built'],
  [0.25, 'Setting in', 'Posts and frame go up'],
  [0.55, 'Taking shape', 'Boards run along the boundary'],
  [0.85, 'Finished fence', 'Cedar, squared up, built to stand'],
]

export default function ScrollVideo() {
  const wrap = useRef(null)
  const videoRef = useRef(null)
  const p = useScrollProgress(wrap)
  const small = useMedia('(max-width: 640px)')
  const still = useMedia('(prefers-reduced-motion: reduce)')
  const [src, setSrc] = useState(null)
  const [ready, setReady] = useState(false)

  const t = still ? 1 : p
  const media = small ? PORTRAIT : LANDSCAPE

  /* Download the clip fully before any seeking: seeking a streamed file waits
     on the network, which is what made the build look like a hard cut. */
  useEffect(() => {
    let dead = false
    let objectUrl
    setReady(false)
    setSrc(null)
    ;(async () => {
      for (const url of media.sources) {
        try {
          const ctrl = new AbortController()
          const timer = setTimeout(() => ctrl.abort(), 15000)
          const res = await fetch(url, { signal: ctrl.signal })
          clearTimeout(timer)
          const type = res.headers.get('content-type') || ''
          if (!res.ok || type.includes('text/html')) continue
          const blob = await res.blob()
          if (dead) return
          objectUrl = URL.createObjectURL(blob)
          setSrc(objectUrl)
          return
        } catch { /* unreachable or timed out — try the next source */ }
      }
      // Fetch failed everywhere (some mobile browsers restrict it): let the
      // video element stream the URL itself instead of giving up.
      if (!dead) setSrc(media.sources[media.sources.length - 1])
    })()
    return () => {
      dead = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [media])

  /* iOS Safari ignores preload and will not fetch video data until load() is
     called - and often not until a muted play() is attempted. Prime it both
     ways and treat any of the ready events, or readyState itself, as ready. */
  useEffect(() => {
    if (!src) return
    const el = videoRef.current
    if (!el) return
    let done = false
    const mark = () => {
      if (done) return
      done = true
      setReady(true)
      el.pause()
    }
    for (const ev of ['loadedmetadata', 'loadeddata', 'canplay', 'playing']) {
      el.addEventListener(ev, mark, { once: true })
    }
    el.load()
    const prime = el.play()
    if (prime && prime.catch) prime.catch(() => {}) // blocked play is fine; load() still ran
    const poll = setInterval(() => { if (el.readyState >= 2) { mark(); clearInterval(poll) } }, 250)
    return () => {
      clearInterval(poll)
      for (const ev of ['loadedmetadata', 'loadeddata', 'canplay', 'playing']) {
        el.removeEventListener(ev, mark)
      }
    }
  }, [src])

  /* One seek per animation frame, easing toward the scroll position. No frame
     buffer: at this size the browser decodes on demand for ~zero memory. */
  const targetRef = useRef(0)
  targetRef.current = t
  useEffect(() => {
    if (!ready) return
    let raf
    let pos = targetRef.current
    const tick = () => {
      const el = videoRef.current
      if (el && el.duration) {
        pos += (targetRef.current - pos) * 0.16
        if (Math.abs(targetRef.current - pos) < 0.0015) pos = targetRef.current
        const want = Math.min(el.duration - 0.05, pos * el.duration)
        if (Math.abs(el.currentTime - want) > 0.02 && el.readyState >= 1) {
          try { el.currentTime = want } catch { /* seek raced a reload */ }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  const cap = CAPTIONS.reduce((acc, c) => (t >= c[0] ? c : acc), CAPTIONS[0])

  return (
    <section ref={wrap} id="top" className="relative bg-forest"
             style={{ height: still ? '100vh' : small ? '320vh' : '420vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Inlined blur-up: paints on first frame, no request, never broken */}
        <div aria-hidden="true"
             className="absolute inset-0 bg-cover bg-center"
             style={{ backgroundImage: `url(${media.blur})`, filter: 'blur(18px)', transform: 'scale(1.08)' }} />

        {src && (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            onError={() => {
              // Blob or codec hiccup: fall back to streaming straight from the URL.
              if (src !== media.sources[media.sources.length - 1]) {
                setReady(false)
                setSrc(media.sources[media.sources.length - 1])
              }
            }}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: ready ? 1 : 0 }}
          />
        )}

        <div aria-hidden="true"
             className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/45" />

        <HeroOverlay t={t} still={still} captionTitle={cap[1]} captionNote={cap[2]} />
      </div>
    </section>
  )
}
