import Reveal from './Reveal'

const steps = [
  { n: '01', t: 'Walk the property', d: 'We meet you on site, listen to what bothers you about the yard, and measure. Free, about 30 minutes.' },
  { n: '02', t: 'Fixed written quote', d: 'A line-item price within 48 hours. No ranges, no "depends", no surprise change orders later.' },
  { n: '03', t: 'We build it', d: 'One crew, start to finish. You get a start date and a finish date, and we hit them.' },
  { n: '04', t: 'We keep it', d: 'Optional care plan so the yard looks the same in year three as it does the week we hand it over.' },
]

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-600 tracking-[0.24em] text-clay uppercase">How it works</p>
          <h2 className="mt-4 max-w-2xl text-4xl leading-[1.08] font-600 text-forest sm:text-5xl">
            Four steps. No chasing us for a callback.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <li className="relative h-full rounded-[26px] bg-sand/55 p-8 ring-1 ring-ink/8">
                <span className="font-display text-5xl font-600 text-clay/35">{s.n}</span>
                <h3 className="mt-4 text-xl font-600 text-forest">{s.t}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/65">{s.d}</p>
                {i < steps.length - 1 && (
                  <svg viewBox="0 0 24 24" aria-hidden="true"
                       className="absolute top-1/2 -right-3.5 hidden h-7 w-7 -translate-y-1/2 text-clay/45 lg:block"
                       fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
