import { useEffect, useState } from 'react'
import Reveal from './Reveal'

const reviews = [
  { q: 'They regraded the side yard that flooded every summer for six years. Two other companies told me to just live with it. It has been dry through two rainy seasons now.', n: 'Danielle R.', l: 'Carrollwood', s: 'Drainage & regrading' },
  { q: 'Quoted on a Tuesday, started the following Monday, finished on the day they said. I have never had a contractor do that. The paver work is genuinely beautiful.', n: 'Marcus T.', l: 'Seminole Heights', s: 'Paver patio & wall' },
  { q: 'We have been on their biweekly plan for three years. Same two guys every visit, they know the yard, and the hedges have never looked better.', n: 'Priya S.', l: 'Westchase', s: 'Maintenance plan' },
]

export default function Testimonials() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % reviews.length), 7000)
    return () => clearInterval(id)
  }, [])

  const r = reviews[i]

  return (
    <section id="reviews" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="flex justify-center gap-1.5 text-clay" aria-label="Rated 4.9 out of 5">
            {Array.from({ length: 5 }, (_, k) => (
              <svg key={k} viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8Z" />
              </svg>
            ))}
          </div>

          <blockquote key={i} className="rise mt-8">
            <p className="font-display text-2xl leading-snug font-500 text-forest sm:text-[2.1rem]">
              “{r.q}”
            </p>
            <footer className="mt-7 text-sm text-ink/60">
              <span className="font-600 text-ink/80">{r.n}</span> · {r.l} · {r.s}
            </footer>
          </blockquote>

          <div className="mt-9 flex justify-center gap-2.5">
            {reviews.map((_, k) => (
              <button key={k} type="button" onClick={() => setI(k)}
                      aria-label={`Show review ${k + 1}`} aria-current={k === i}
                      className={`h-2 rounded-full transition-all duration-300
                                  ${k === i ? 'w-9 bg-forest' : 'w-2 bg-ink/20 hover:bg-ink/40'}`} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
