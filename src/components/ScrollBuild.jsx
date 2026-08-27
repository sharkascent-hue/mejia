import { memo, useRef } from 'react'
import { useScrollProgress, useMedia, seg, easeOut, lerp } from '../lib/scroll'

/* ---------- geometry: one yard, built in place ---------- */
const BACK_Y = 548, FRONT_Y = 772
const BACK_L = 505, BACK_R = 985, FRONT_L = 455, FRONT_R = 1035
const edgeAt = (y) => {
  const t = (y - BACK_Y) / (FRONT_Y - BACK_Y)
  return [lerp(BACK_L, FRONT_L, t), lerp(BACK_R, FRONT_R, t)]
}
const ROWS = 13
const deckRows = Array.from({ length: ROWS }, (_, i) => {
  const y0 = lerp(BACK_Y, FRONT_Y, i / ROWS)
  const y1 = lerp(BACK_Y, FRONT_Y, (i + 1) / ROWS)
  const [l0, r0] = edgeAt(y0)
  const [l1, r1] = edgeAt(y1)
  return { i, y0, points: `${l0},${y0} ${r0},${y0} ${r1},${y1} ${l1},${y1}` }
})
const joistYs = Array.from({ length: 7 }, (_, i) => lerp(BACK_Y + 10, FRONT_Y - 10, i / 6))
const footings = [[470, 762], [610, 762], [750, 762], [890, 762], [1020, 762],
                  [512, 566], [710, 566], [908, 566]]
const railPosts = [FRONT_L + 6, 560, 665, 845, 950, FRONT_R - 6]
const fencePosts = Array.from({ length: 19 }, (_, i) => 15 + i * 76)

const STAGES = [
  { at: 0.06, label: 'Bare yard' },
  { at: 0.16, label: 'Layout & marking' },
  { at: 0.28, label: 'Base & footings' },
  { at: 0.44, label: 'Framing' },
  { at: 0.62, label: 'Decking' },
  { at: 0.74, label: 'Rails & steps' },
  { at: 0.86, label: 'Fencing' },
  { at: 1.00, label: 'Planting & lighting' },
]

/* ---------- layers that never change: memoised so scrolling stays cheap ---------- */
const StaticScene = memo(function StaticScene() {
  return (
    <>
      <rect width="1400" height="560" fill="url(#sb-sky)" />
      <circle cx="1180" cy="130" r="54" fill="#F7E3AC" opacity="0.9" />

      {/* treeline */}
      <path d="M0 452 Q90 372 180 418 Q265 344 356 410 Q450 338 540 408 Q630 348 720 404
               Q812 336 902 410 Q995 350 1086 412 Q1175 348 1264 414 Q1340 372 1400 424
               L1400 480 L0 480 Z" fill="#2F5738" opacity="0.9" />

      {/* lawn */}
      <rect y="548" width="1400" height="700" fill="url(#sb-lawn)" />
      <ellipse cx="700" cy="560" rx="760" ry="26" fill="#4B8250" opacity="0.5" />

      {/* house */}
      <g>
        <polygon points="700,116 1046,238 354,238" fill="#39413F" />
        <polygon points="700,116 1046,238 1010,238 700,148" fill="#4A5350" />
        <rect x="430" y="232" width="540" height="318" fill="#EFEBE1" />
        <rect x="430" y="232" width="540" height="318" fill="none" stroke="#D8D2C4" strokeWidth="3" />
        {[268, 350].map((y) => [470, 590, 790, 890].map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="72" height="62" rx="3" fill="#3E5763" />
            <rect x={x} y={y} width="72" height="62" rx="3" fill="none" stroke="#FBFAF6" strokeWidth="5" />
          </g>
        )))}
        {/* sliding door onto the deck */}
        <rect x="646" y="418" width="118" height="132" fill="#33505E" />
        <rect x="646" y="418" width="118" height="132" fill="none" stroke="#FBFAF6" strokeWidth="6" />
        <line x1="705" y1="418" x2="705" y2="550" stroke="#FBFAF6" strokeWidth="5" />
        <rect x="424" y="540" width="552" height="12" fill="#DAD3C4" />
      </g>
    </>
  )
})

export default function ScrollBuild() {
  const wrap = useRef(null)
  const p = useScrollProgress(wrap)
  const small = useMedia('(max-width: 640px)')
  const still = useMedia('(prefers-reduced-motion: reduce)')
  const t = still ? 1 : p

  // stage helpers
  const layout = seg(t, 0.06, 0.16)
  const base   = seg(t, 0.16, 0.28)
  const frame  = seg(t, 0.28, 0.44)
  const rails  = seg(t, 0.62, 0.74)
  const fence  = seg(t, 0.74, 0.86)
  const green  = seg(t, 0.86, 0.95)
  const dusk   = seg(t, 0.92, 1)

  const stageIdx = STAGES.findIndex((s) => t <= s.at)
  const stage = STAGES[stageIdx === -1 ? STAGES.length - 1 : stageIdx]

  return (
    <section ref={wrap} className="relative" style={{ height: still ? 'auto' : small ? '340vh' : '420vh' }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#BFD9E8]
                          shadow-[0_24px_70px_rgba(18,26,20,0.22)] ring-1 ring-ink/10
                          sm:aspect-[16/10] lg:aspect-[16/9]">
            <svg viewBox={small ? '380 116 730 912' : '0 95 1400 800'} preserveAspectRatio="xMidYMid slice"
                 className="h-full w-full" aria-hidden="true"
                 style={{ transform: `scale(${1 + easeOut(t) * 0.04})`, transformOrigin: '50% 56%' }}>
              <defs>
                <linearGradient id="sb-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8CC1DE" /><stop offset="100%" stopColor="#DDEAF1" />
                </linearGradient>
                <linearGradient id="sb-lawn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#54924F" /><stop offset="100%" stopColor="#3D7344" />
                </linearGradient>
                <radialGradient id="sb-glow"><stop offset="0%" stopColor="#FFCE7A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FFCE7A" stopOpacity="0" /></radialGradient>
              </defs>

              <StaticScene />

              {/* 2 — string lines and stakes mark the footprint */}
              <g opacity={layout * (1 - seg(t, 0.42, 0.5))}>
                <polygon points={`${BACK_L},${BACK_Y} ${BACK_R},${BACK_Y} ${FRONT_R},${FRONT_Y} ${FRONT_L},${FRONT_Y}`}
                         fill="#F4F1E6" fillOpacity="0.12" stroke="#F7F4ED" strokeWidth="3"
                         strokeDasharray="16 12" strokeLinejoin="round" />
                {footings.map(([x, y], i) => (
                  <g key={i} opacity={seg(layout, i / 12, i / 12 + 0.4)}>
                    <line x1={x} y1={y} x2={x} y2={y - 34} stroke="#E8E2D2" strokeWidth="4" />
                    <path d={`M${x} ${y - 34} l16 7 -16 7Z`} fill="#C4703F" />
                  </g>
                ))}
              </g>

              {/* 3 — excavated base and concrete footings */}
              <g opacity={base}>
                <polygon points={`${BACK_L - 8},${BACK_Y} ${BACK_R + 8},${BACK_Y} ${FRONT_R + 8},${FRONT_Y + 8} ${FRONT_L - 8},${FRONT_Y + 8}`}
                         fill="#6E6455" />
                <polygon points={`${BACK_L},${BACK_Y + 4} ${BACK_R},${BACK_Y + 4} ${FRONT_R},${FRONT_Y} ${FRONT_L},${FRONT_Y}`}
                         fill="#8B8172" />
                {footings.map(([x, y], i) => (
                  <ellipse key={i} cx={x} cy={y - 6} rx="26" ry="11"
                           fill="#A9A192" opacity={seg(base, i / 10, i / 10 + 0.5)} />
                ))}
              </g>

              {/* 4 — frame goes in: beams then joists */}
              <g opacity={frame}>
                {joistYs.map((y, i) => {
                  const [l, r] = edgeAt(y)
                  const a = seg(frame, i / 9, i / 9 + 0.45)
                  return <rect key={i} x={lerp(l + 60, l, a)} y={y - 5} width={(r - l) * a} height="10"
                               rx="2" fill="#8A5F3C" />
                })}
                {footings.slice(0, 5).map(([x, y], i) => (
                  <rect key={i} x={x - 9} y={y - 46} width="18" height="46" rx="2" fill="#7A5334"
                        opacity={seg(frame, 0.3 + i / 14, 0.6 + i / 14)} />
                ))}
              </g>

              {/* 5 — decking boards lay from the house outward */}
              {deckRows.map((row) => {
                const a = easeOut(seg(t, 0.44 + row.i * 0.012, 0.50 + row.i * 0.012))
                if (a <= 0) return null
                return (
                  <g key={row.i} opacity={a}>
                    <polygon points={row.points} fill={row.i % 2 ? '#B07A47' : '#A5713F'}
                             transform={`translate(0 ${(1 - a) * -26})`} />
                    <polygon points={row.points} fill="#000" opacity="0.06"
                             transform={`translate(0 ${(1 - a) * -26})`} />
                  </g>
                )
              })}
              <g opacity={seg(t, 0.56, 0.64)}>
                <polygon points={`${FRONT_L},${FRONT_Y} ${FRONT_R},${FRONT_Y} ${FRONT_R},${FRONT_Y + 16} ${FRONT_L},${FRONT_Y + 16}`}
                         fill="#8A5F3C" />
              </g>

              {/* 6 — rails, then steps down to the lawn */}
              <g opacity={rails}>
                {railPosts.map((x, i) => {
                  const a = seg(rails, i / 8, i / 8 + 0.4)
                  return <rect key={x} x={x - 7} y={FRONT_Y - 96 * a} width="16" height={96 * a} rx="2" fill="#7A5334" />
                })}
                <rect x={FRONT_L} y={FRONT_Y - 104} width={FRONT_R - FRONT_L} height="17" rx="4"
                      fill="#8A5F3C" opacity={seg(rails, 0.45, 0.75)} />
                <rect x={FRONT_L} y={FRONT_Y - 62} width={FRONT_R - FRONT_L} height="9" rx="2"
                      fill="#7A5334" opacity={seg(rails, 0.55, 0.85)} />
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={665 - i * 9} y={FRONT_Y + 14 + i * 20} width={170 + i * 18} height="20" rx="3"
                        fill={i % 2 ? '#A5713F' : '#B07A47'} opacity={seg(rails, 0.6 + i * 0.1, 0.8 + i * 0.1)} />
                ))}
              </g>

              {/* 7 — fence rises across the yard */}
              <g opacity={fence}>
                {fencePosts.map((x, i) => {
                  if (x > 400 && x < 1010) return null
                  const a = easeOut(seg(fence, (i % 10) / 16, (i % 10) / 16 + 0.5))
                  return (
                    <g key={x}>
                      <rect x={x} y={565 - 96 * a} width="13" height={96 * a} fill="#9A7A55" />
                      <rect x={x + 13} y={548 - 78 * a} width="63" height={78 * a} fill="#B08F66" opacity="0.96" />
                      <rect x={x + 13} y={548 - 78 * a} width="63" height={78 * a} fill="none"
                            stroke="#8E6F4C" strokeWidth="1.5" />
                    </g>
                  )
                })}
              </g>

              {/* 8 — planting, then the lights come on */}
              <g opacity={green}>
                {[[452, 542, 30], [520, 540, 24], [1000, 542, 28], [1060, 540, 22], [386, 544, 26]].map(([x, y, r], i) => (
                  <g key={i} opacity={seg(green, i / 7, i / 7 + 0.5)}>
                    <ellipse cx={x} cy={y} rx={r} ry={r * 0.8} fill="#33603A" />
                    <ellipse cx={x - r * 0.3} cy={y - r * 0.25} rx={r * 0.45} ry={r * 0.3} fill="#4A7C4E" opacity="0.7" />
                  </g>
                ))}
                <path d="M1080 806 q120 -40 260 -14 l0 60 -260 0 Z" fill="#6B4A32" />
                {[[1120, 796], [1180, 786], [1240, 782], [1300, 790]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="9" fill={i % 2 ? '#C4703F' : '#E8B77E'}
                          opacity={seg(green, 0.5 + i / 10, 0.8 + i / 10)} />
                ))}
                <path d="M60 806 q120 -40 250 -14 l0 60 -250 0 Z" fill="#6B4A32" />
              </g>

              {/* dusk + lighting payoff */}
              <g opacity={dusk} style={{ pointerEvents: 'none' }}>
                <rect y="-40" width="1400" height="1300" fill="#241A38" opacity="0.42" />
                {[470, 590, 790, 890].map((x) => (
                  <rect key={x} x={x} y={268} width="72" height="62" rx="3" fill="#FFD489" opacity="0.85" />
                ))}
                <rect x="646" y="418" width="118" height="132" fill="#FFD489" opacity="0.7" />
                {railPosts.map((x) => (
                  <g key={x}>
                    <circle cx={x} cy={FRONT_Y - 104} r="52" fill="url(#sb-glow)" />
                    <circle cx={x} cy={FRONT_Y - 104} r="6" fill="#FFE6B0" />
                  </g>
                ))}
                <circle cx="700" cy="600" r="330" fill="url(#sb-glow)" opacity="0.35" />
              </g>
            </svg>

            {/* ---------- overlay copy ---------- */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
              <div style={{ opacity: 1 - seg(t, 0.02, 0.14), transform: `translateY(${seg(t, 0.02, 0.14) * -18}px)` }}>
                <span className="inline-flex items-center gap-2 rounded-full bg-ink/60 px-4 py-2
                                 text-[0.65rem] font-600 tracking-[0.18em] text-canvas uppercase backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" /> One yard, start to finish
                </span>
                <h2 className="mt-4 max-w-lg font-display text-3xl leading-[1.05] font-600 text-white
                               [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-5xl">
                  Built like it's<br /><span className="italic text-clay-lt">ours.</span>
                </h2>
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <div style={{ opacity: seg(t, 0.03, 0.1) }}>
                    <span className="text-[0.62rem] font-600 tracking-[0.2em] text-canvas/60 uppercase">
                      Step {Math.max(1, stageIdx + 1)} of {STAGES.length}
                    </span>
                    <p className="mt-1 font-display text-xl font-600 text-white
                                  [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] sm:text-2xl">
                      {stage.label}
                    </p>
                  </div>
                  <span className="rounded-full bg-ink/55 px-3 py-1.5 text-[0.62rem] font-600
                                   tracking-[0.16em] text-canvas uppercase backdrop-blur"
                        style={{ opacity: 1 - seg(t, 0.02, 0.12) }}>
                    Scroll ↓
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas/25">
                  <div className="h-full rounded-full bg-clay transition-[width] duration-100"
                       style={{ width: `${t * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
