import { useEffect, useRef, useState } from 'react'
import { useScrollProgress, useMedia } from '../lib/scroll'
import PhotoBuild from './PhotoBuild'
import HeroOverlay from './HeroOverlay'

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ecce44mke0LAFhuakx5m04bD91'

/* Phones get a purpose-made 9:16 recomposition of the same garden - the whole
   house and the side fence stay in frame instead of being cropped away by
   object-cover. Files dropped into public/video/ win over the generation CDN. */
const LANDSCAPE = {
  posters: ['/video/poster.jpg', `${CDN}/hf_20260825_201414_a3c505aa-aae1-4a46-a395-9bb7b929d9f0.png`],
  sources: [
    '/video/fence-build.webm',
    '/video/fence-build.mp4',
    `${CDN}/hf_20260825_202728_1ce7bbc8-5a99-4c07-abda-c9d48fce6029.mp4`,
  ],
}
const PORTRAIT = {
  posters: ['/video/poster-portrait.jpg', `${CDN}/hf_20260826_114104_d75c1adc-975a-4614-8345-bb02852cdadd.png`],
  sources: [
    '/video/fence-build-portrait.webm',
    '/video/fence-build-portrait.mp4',
    `${CDN}/hf_20260826_114242_f2580a9f-97bf-49f9-b155-02214d3e9c0d.mp4`,
  ],
}

const FRAMES = 48
const CACHE_NAME = 'fence-frames-v1'

/* Coarse-to-fine capture order: ends first, then midpoints, so the whole
   timeline is roughly scrubbable after a handful of frames and merely
   sharpens as the rest arrive. For 48: 0, 47, 23, 11, 35, 5, 17, ... */
const captureOrder = (() => {
  const out = [0, FRAMES - 1]
  const q = [[0, FRAMES - 1]]
  while (q.length) {
    const [a, b] = q.shift()
    if (b - a < 2) continue
    const m = (a + b) >> 1
    out.push(m)
    q.push([a, m], [m, b])
  }
  return out
})()

const cacheKey = (src, i) => `/__fence-frames__/${encodeURIComponent(src)}/${i}`

export default function ScrollVideo() {
  const wrap = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const drawnRef = useRef(-1)
  const p = useScrollProgress(wrap)
  const small = useMedia('(max-width: 640px)')
  const still = useMedia('(prefers-reduced-motion: reduce)')
  // 'warming' scrubs whatever frames exist; only a total failure falls back.
  const [phase, setPhase] = useState('warming')
  const [posterIdx, setPosterIdx] = useState(0)

  const t = still ? 1 : p
  const media = small ? PORTRAIT : LANDSCAPE

  useEffect(() => {
    let dead = false
    let objectUrl
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const sizeCanvas = (w, h) => {
      const c = canvasRef.current
      if (c && (c.width !== w || c.height !== h)) { c.width = w; c.height = h }
    }

    const openCache = async () => {
      try { return typeof caches !== 'undefined' ? await caches.open(CACHE_NAME) : null }
      catch { return null } // http:// on a LAN IP has no Cache API - fine
    }

    // Instant path: a previous visit already stored every frame.
    const restore = async (cache, src) => {
      if (!cache) return false
      const first = await cache.match(cacheKey(src, 0))
      if (!first) return false
      const hits = await Promise.all(
        Array.from({ length: FRAMES }, (_, i) => cache.match(cacheKey(src, i)))
      )
      if (hits.some((h) => !h)) return false
      const bitmaps = await Promise.all(hits.map(async (h) => createImageBitmap(await h.blob())))
      if (dead) return true
      framesRef.current = bitmaps
      sizeCanvas(bitmaps[0].width, bitmaps[0].height)
      return true
    }

    const seekTo = (time) =>
      new Promise((res, rej) => {
        const ok = () => { cleanup(); res() }
        const bad = () => { cleanup(); rej(new Error('seek failed')) }
        const cleanup = () => {
          video.removeEventListener('seeked', ok)
          video.removeEventListener('error', bad)
        }
        video.addEventListener('seeked', ok, { once: true })
        video.addEventListener('error', bad, { once: true })
        video.currentTime = time
      })

    ;(async () => {
      try {
        const cache = await openCache()
        for (const src of media.sources) {
          if (await restore(cache, src)) { if (!dead) setPhase('warming'); return }
        }

        let blob = null, chosen = null
        for (const src of media.sources) {
          try {
            const res = await fetch(src)
            const type = res.headers.get('content-type') || ''
            if (res.ok && !type.includes('text/html')) { blob = await res.blob(); chosen = src; break }
          } catch { /* CORS or offline - try the next source */ }
        }
        if (!blob) throw new Error('no source reachable')
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        await new Promise((res, rej) => {
          video.addEventListener('loadedmetadata', res, { once: true })
          video.addEventListener('error', () => rej(new Error('load failed')), { once: true })
        })

        const dur = video.duration
        const scale = Math.min(1, Math.sqrt(780000 / (video.videoWidth * video.videoHeight)))
        const w = Math.round(video.videoWidth * scale)
        const h = Math.round(video.videoHeight * scale)
        sizeCanvas(w, h)
        const off = document.createElement('canvas')
        off.width = w; off.height = h
        const ctx = off.getContext('2d')

        for (const i of captureOrder) {
          if (dead) return
          await seekTo(Math.min(dur - 0.03, (i / (FRAMES - 1)) * dur))
          ctx.drawImage(video, 0, 0, w, h)
          framesRef.current[i] = await createImageBitmap(off)
          if (cache) {
            // Persist for instant repeat visits; failures are irrelevant.
            off.toBlob((b) => { if (b) cache.put(cacheKey(chosen, i), new Response(b)).catch(() => {}) },
                       'image/webp', 0.82)
          }
        }
      } catch {
        if (!dead) setPhase('failed')
      }
    })()

    return () => {
      dead = true
      framesRef.current.forEach((f) => f?.close?.())
      framesRef.current = []
      drawnRef.current = -1
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      video.removeAttribute('src')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media])

  // Glide toward the scroll position, drawing the nearest frame that has been
  // captured so far - the scrub works from the first second and refines.
  const targetRef = useRef(0)
  targetRef.current = t
  useEffect(() => {
    if (phase === 'failed') return
    let raf
    let pos = targetRef.current * (FRAMES - 1)
    const nearest = (idx) => {
      const fs = framesRef.current
      if (fs[idx]) return idx
      for (let d = 1; d < FRAMES; d++) {
        if (fs[idx - d]) return idx - d
        if (fs[idx + d]) return idx + d
      }
      return -1
    }
    const tick = () => {
      const target = targetRef.current * (FRAMES - 1)
      pos += (target - pos) * 0.14
      if (Math.abs(target - pos) < 0.01) pos = target
      const want = Math.max(0, Math.min(FRAMES - 1, Math.round(pos)))
      const best = nearest(want)
      if (best !== -1 && best !== drawnRef.current && canvasRef.current) {
        drawnRef.current = best
        canvasRef.current.getContext('2d').drawImage(framesRef.current[best], 0, 0)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  if (phase === 'failed') return <PhotoBuild />

  const CAPTIONS = [
    [0.00, 'The garden as it is', 'Open boundary, nothing built'],
    [0.25, 'Setting in', 'Posts and frame go up'],
    [0.55, 'Taking shape', 'Boards run along the boundary'],
    [0.85, 'Finished fence', 'Cedar, squared up, built to stand'],
  ]
  const cap = CAPTIONS.reduce((acc, c) => (t >= c[0] ? c : acc), CAPTIONS[0])

  return (
    <section ref={wrap} id="top" className="relative bg-forest"
             style={{ height: still ? '100vh' : small ? '340vh' : '460vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Poster is frame zero: the page is visually complete immediately */}
        <img src={media.posters[Math.min(posterIdx, media.posters.length - 1)]}
             onError={() => setPosterIdx((i) => i + 1)}
             alt="" aria-hidden="true"
             className="absolute inset-0 h-full w-full object-cover" />
        <canvas ref={canvasRef} aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover" />

        <div aria-hidden="true"
             className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/45" />

        <HeroOverlay t={t} still={still} captionTitle={cap[1]} captionNote={cap[2]} />
      </div>
    </section>
  )
}
