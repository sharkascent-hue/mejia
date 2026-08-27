import BeforeAfter from './BeforeAfter'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Organic blobs — the biophilic "flowing shapes" cue, kept very soft */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-40 h-[34rem] w-[34rem] rounded-full bg-sage/35 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-64 -left-52 h-[28rem] w-[28rem] rounded-full bg-clay-lt/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_1.28fr] lg:gap-16">
          <div>
            <span className="rise inline-flex items-center gap-2 rounded-full bg-forest/8 px-4 py-2
                             text-xs font-600 tracking-[0.16em] text-forest uppercase ring-1 ring-forest/15">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" />
              Serving Tampa Bay since 2011
            </span>

            <h1 className="rise mt-7 text-[2.7rem] leading-[1.02] font-600 text-forest sm:text-6xl lg:text-[4.1rem]"
                style={{ animationDelay: '80ms' }}>
              Your yard,<br />
              <span className="italic text-clay">quietly</span> transformed.
            </h1>

            <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink/70" style={{ animationDelay: '160ms' }}>
              Design, build and year-round care from one crew that shows up when it says it will.
              Drag the slider — that is a real scope of work, not a stock photo.
            </p>

            <div className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '240ms' }}>
              <a href="#quote"
                 className="rounded-full bg-forest px-8 py-4 text-center text-sm font-600 text-canvas shadow-soft
                            transition-transform hover:-translate-y-0.5 hover:bg-moss">
                Get a free estimate
              </a>
              <a href="#work"
                 className="rounded-full px-8 py-4 text-center text-sm font-600 text-forest ring-1 ring-forest/25
                            transition-colors hover:bg-forest/6">
                See the work
              </a>
            </div>

            <dl className="rise mt-11 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-7"
                style={{ animationDelay: '320ms' }}>
              {[['14 yrs', 'in business'], ['600+', 'yards served'], ['4.9★', 'avg. rating']].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-600 text-forest sm:text-3xl">{n}</dt>
                  <dd className="mt-1 text-xs tracking-wide text-ink/55 uppercase">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise" style={{ animationDelay: '200ms' }}>
            <BeforeAfter />
          </div>
        </div>
      </div>
    </section>
  )
}
