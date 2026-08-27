/**
 * Hero content laid over the scroll-build media. Shown in full at the top,
 * fades up and away over the first stretch of scrolling so the build takes
 * the stage; the caption + progress rail stay pinned at the bottom.
 */
export default function HeroOverlay({ t, still, captionTitle, captionNote }) {
  // Under reduced motion t is pinned to 1; never hide the headline there.
  const gone = still ? 0 : Math.min(1, t / 0.12)

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
      <div className="mx-auto w-full max-w-7xl flex-1 px-5 pt-28 sm:px-8 sm:pt-36"
           style={{ opacity: 1 - gone, transform: `translateY(${gone * -26}px)` }}>
        <span className="inline-flex items-center gap-2 rounded-full bg-ink/45 px-4 py-2
                         text-xs font-600 tracking-[0.16em] text-canvas uppercase ring-1 ring-canvas/20 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-clay-lt" />
          Serving Tampa Bay since 2011
        </span>

        <h1 className="mt-7 max-w-3xl font-display text-[2.7rem] leading-[1.02] font-600 text-white
                       [text-shadow:0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-[4.3rem]">
          Your yard,<br />
          <span className="italic text-clay-lt">quietly</span> transformed.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-canvas/85
                      [text-shadow:0_1px_16px_rgba(0,0,0,0.5)]">
          Design, build and year-round care from one crew that shows up when it
          says it will. Keep scrolling — that fence builds itself.
        </p>

        <div className={`mt-9 flex flex-col gap-3 sm:flex-row sm:items-center ${gone < 0.6 ? 'pointer-events-auto' : ''}`}>
          <a href="#quote"
             className="rounded-full bg-canvas px-8 py-4 text-center text-sm font-600 text-forest shadow-soft
                        transition-transform hover:-translate-y-0.5">
            Get a free estimate
          </a>
          <a href="#work"
             className="rounded-full px-8 py-4 text-center text-sm font-600 text-canvas ring-1 ring-canvas/45
                        backdrop-blur transition-colors hover:bg-canvas/10">
            See the work
          </a>
        </div>

        <dl className="mt-11 grid max-w-md grid-cols-3 gap-6 border-t border-canvas/25 pt-7">
          {[['14 yrs', 'in business'], ['600+', 'yards served'], ['4.9★', 'avg. rating']].map(([n, l]) => (
            <div key={l}>
              <dt className="font-display text-2xl font-600 text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.5)] sm:text-3xl">{n}</dt>
              <dd className="mt-1 text-xs tracking-wide text-canvas/70 uppercase">{l}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xl font-600 text-white
                          [text-shadow:0_2px_18px_rgba(0,0,0,0.6)] sm:text-2xl">{captionTitle}</p>
            <p className="mt-0.5 text-sm text-canvas/70">{captionNote}</p>
          </div>
          <span className="rounded-full bg-ink/55 px-3 py-1.5 text-[0.62rem] font-600 tracking-[0.16em]
                           text-canvas uppercase backdrop-blur"
                style={{ opacity: 1 - gone }}>
            Scroll ↓
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas/25">
          <div className="h-full rounded-full bg-clay" style={{ width: `${t * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
