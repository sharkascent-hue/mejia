import Reveal from './Reveal'
import YardScene from './YardScene'

const projects = [
  { name: 'Hyde Park renovation', scope: 'Full re-sod, paver walkway, bed rebuild', span: 'lg:col-span-7', weeks: '3 weeks' },
  { name: 'Seminole Heights patio', scope: 'Travertine patio, retaining wall, uplighting', span: 'lg:col-span-5', weeks: '5 weeks' },
  { name: 'Westchase maintenance', scope: 'Biweekly care, hedge shaping, mulch refresh', span: 'lg:col-span-5', weeks: 'Ongoing' },
  { name: 'Carrollwood drainage fix', scope: 'Regrade, French drain, replanting', span: 'lg:col-span-7', weeks: '2 weeks' },
]

export default function Work() {
  return (
    <section id="work" className="grain relative overflow-hidden bg-forest py-24 text-canvas sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-600 tracking-[0.24em] text-clay-lt uppercase">Recent work</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-2xl text-4xl leading-[1.08] font-600 sm:text-5xl">
              Yards we would happily drive you past.
            </h2>
            <a href="#quote" className="text-sm font-600 text-clay-lt underline decoration-clay-lt/40 underline-offset-8 hover:decoration-clay-lt">
              Start yours →
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 80} className={p.span}>
              <article className="group relative h-full overflow-hidden rounded-[26px] ring-1 ring-canvas/12">
                <div className="aspect-[16/10] transition-transform duration-700 group-hover:scale-[1.04]">
                  <YardScene variant="after" seed={i} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="rounded-full bg-canvas/15 px-3 py-1 text-[0.68rem] font-600 tracking-[0.14em] uppercase backdrop-blur">
                    {p.weeks}
                  </span>
                  <h3 className="mt-3 text-2xl font-600">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-canvas/70">{p.scope}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
