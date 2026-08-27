import Reveal from './Reveal'

const services = [
  {
    title: 'Lawn Maintenance',
    body: 'Weekly or biweekly mowing, edging, blowing and trimming on a fixed schedule you can set your watch by.',
    points: ['Mow, edge & blow', 'Hedge trimming', 'Seasonal cleanups'],
    icon: (
      <>
        <path d="M3 17h18M6 17v-4a3 3 0 0 1 3-3h2" />
        <circle cx="7" cy="19.5" r="2" /><circle cx="18" cy="19.5" r="2" />
        <path d="M11 10V7a3 3 0 0 1 6 0v8" />
      </>
    ),
  },
  {
    title: 'Landscape Design',
    body: 'Full redesigns with planting plans drawn to your light, soil and how you actually use the yard.',
    points: ['Planting plans', 'Sod & regrading', 'Native selections'],
    icon: (
      <>
        <path d="M12 20v-8" />
        <path d="M12 12c0-4 3-7 7-8 0 5-3 8-7 8Z" />
        <path d="M12 15c0-3-2.5-5.5-6-6 0 3.5 2.5 6 6 6Z" />
      </>
    ),
  },
  {
    title: 'Hardscaping',
    body: 'Paver walkways, patios, retaining walls and fire pits built on a base that will not settle in two years.',
    points: ['Paver patios', 'Retaining walls', 'Walkways & steps'],
    icon: (
      <>
        <rect x="3" y="5" width="8" height="6" rx="1" /><rect x="13" y="5" width="8" height="6" rx="1" />
        <rect x="3" y="13" width="18" height="6" rx="1" />
      </>
    ),
  },
  {
    title: 'Irrigation & Lighting',
    body: 'Smart controllers, leak repair and low-voltage lighting that makes the yard work after dark.',
    points: ['Sprinkler repair', 'Smart timers', 'Path & uplighting'],
    icon: (
      <>
        <path d="M12 3c3 4.5 5 7.4 5 10a5 5 0 0 1-10 0c0-2.6 2-5.5 5-10Z" />
      </>
    ),
  },
  {
    title: 'Tree & Shrub Care',
    body: 'Structural pruning, shaping and removal — done to keep plants healthy, not just smaller.',
    points: ['Structural pruning', 'Shaping', 'Safe removals'],
    icon: (
      <>
        <path d="M12 21v-6" />
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5 12 15l3.5-1.5" />
      </>
    ),
  },
  {
    title: 'Mulch & Beds',
    body: 'Clean bed edges, fresh mulch and soil amendment on a schedule that keeps beds looking new.',
    points: ['Bed edging', 'Mulch refresh', 'Weed control'],
    icon: (
      <>
        <path d="M3 16c3-2 6-2 9 0s6 2 9 0" />
        <path d="M3 20c3-2 6-2 9 0s6 2 9 0" />
        <path d="M12 12V6M12 6c0-1.7 1.3-3 3-3 0 1.7-1.3 3-3 3Zm0 0c0-1.7-1.3-3-3-3 0 1.7 1.3 3 3 3Z" />
      </>
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-600 tracking-[0.24em] text-clay uppercase">What we do</p>
          <h2 className="mt-4 max-w-2xl text-4xl leading-[1.08] font-600 text-forest sm:text-5xl">
            Six services, one crew, no subcontractors.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink/65">
            Everything below is handled in-house — which is why the person who quotes your job
            is the person who shows up to do it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <article className="group h-full rounded-[26px] bg-white p-8 ring-1 ring-ink/8
                                  transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(18,26,20,0.1)]">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest/8 text-forest
                                 transition-colors duration-300 group-hover:bg-forest group-hover:text-canvas">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor"
                       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </span>
                <h3 className="mt-6 text-2xl font-600 text-forest">{s.title}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-ink/65">{s.body}</p>
                <ul className="mt-5 space-y-2 border-t border-ink/8 pt-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-ink/70">
                      <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-clay" fill="none"
                           stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 8.5 3.2 3.2L13 5" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
