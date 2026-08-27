/**
 * One yard, two states. Both variants share identical geometry so the
 * before/after wipe lines up pixel-for-pixel as the divider moves.
 */

// Mowing stripes fanned toward a vanishing point so the lawn reads in perspective.
const LAWN_TOP = 345

const makeStripes = (vpX, width) =>
  Array.from({ length: Math.ceil(1720 / width) }, (_, i) => {
    const x0 = -260 + i * width
    const x1 = x0 + width
    const t = (700 - LAWN_TOP) / (700 - 300)
    const p = (x) => x + (vpX - x) * t
    return { key: i, points: `${x0},700 ${x1},700 ${p(x1)},${LAWN_TOP} ${p(x0)},${LAWN_TOP}` }
  })

/* Each project card gets its own yard: mirrored layout, a different mow
   direction, sun position and green. Same primitives, four distinct places. */
const SEEDS = [
  { mirror: false, vpX: 600, stripeW: 140, sunX: 1000, skyTop: '#8FC3DF', lawnTop: '#4C8850', lawnBot: '#3C7042', shrubs: [250, 790, 900, 1010] },
  { mirror: true,  vpX: 430, stripeW: 112, sunX: 300,  skyTop: '#9FCDE2', lawnTop: '#54924F', lawnBot: '#3F7645', shrubs: [180, 700, 960] },
  { mirror: false, vpX: 760, stripeW: 168, sunX: 880,  skyTop: '#86BCDC', lawnTop: '#478450', lawnBot: '#37693E', shrubs: [300, 620, 830, 1060] },
  { mirror: true,  vpX: 540, stripeW: 126, sunX: 420,  skyTop: '#A6D2E6', lawnTop: '#508D53', lawnBot: '#417647', shrubs: [220, 760, 1000] },
]

const dryPatches = [
  [230, 520, 130, 42], [520, 640, 165, 50], [860, 560, 120, 38],
  [1040, 460, 95, 28], [140, 420, 88, 26], [700, 430, 105, 30],
  [380, 415, 70, 22], [960, 660, 140, 44],
]

const weeds = [
  [110, 560], [265, 470], [340, 620], [470, 500], [610, 585],
  [720, 470], [820, 640], [905, 500], [1030, 590], [1130, 480],
  [175, 660], [560, 430], [990, 420],
]

const RADII = [46, 40, 52, 44]

export default function YardScene({ variant, seed = 0 }) {
  const after = variant === 'after'
  const S = SEEDS[seed % SEEDS.length]
  const stripes = makeStripes(S.vpX, S.stripeW)
  const backShrubs = S.shrubs.map((x, i) => ({ x, r: RADII[i % RADII.length] }))
  const uid = `${variant}-${seed}`

  return (
    <svg viewBox="0 0 1200 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={after ? S.skyTop : '#B9BCA9'} />
          <stop offset="100%" stopColor={after ? '#DCEBF2' : '#DAD6C4'} />
        </linearGradient>
        <linearGradient id={`lawn-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={after ? S.lawnTop : '#A99C6E'} />
          <stop offset="100%" stopColor={after ? S.lawnBot : '#B9AE83'} />
        </linearGradient>
        <linearGradient id={`path-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={after ? '#D8CFBD' : '#9E9887'} />
          <stop offset="100%" stopColor={after ? '#C3B9A4' : '#8B8574'} />
        </linearGradient>
      </defs>

      <g transform={S.mirror ? 'translate(1200,0) scale(-1,1)' : undefined}>
      {/* Sky */}
      <rect width="1200" height={LAWN_TOP} fill={`url(#sky-${uid})`} />
      <circle cx={S.sunX} cy="110" r={after ? 52 : 44}
              fill={after ? '#F7DE9E' : '#D3CDB4'} opacity={after ? 0.95 : 0.5} />

      {/* Distant treeline */}
      <path d="M0 300 Q80 232 170 268 Q250 208 340 258 Q430 200 520 262 Q610 214 700 258
               Q790 206 880 264 Q970 220 1060 262 Q1140 226 1200 272 L1200 350 L0 350 Z"
            fill={after ? '#3A6440' : '#767C60'} opacity="0.85" />

      {/* Back fence */}
      <g opacity={after ? 0.95 : 0.75}>
        <rect x="0" y="300" width="1200" height="46" fill={after ? '#8A6A4C' : '#7A6D57'} />
        {Array.from({ length: 40 }, (_, i) => (
          <rect key={i} x={i * 30} y="298" width="22" height="50" rx="3"
                fill={after ? '#9A7856' : '#847660'}
                transform={after ? undefined : `rotate(${i % 5 === 0 ? 2.5 : 0} ${i * 30 + 11} 323)`} />
        ))}
      </g>

      {/* Lawn */}
      <rect y={LAWN_TOP} width="1200" height={700 - LAWN_TOP} fill={`url(#lawn-${uid})`} />

      {after
        ? stripes.map((s, i) => (
            <polygon key={s.key} points={s.points}
                     fill={i % 2 ? '#57975B' : '#41784A'} opacity="0.55" />
          ))
        : dryPatches.map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                     fill={i % 2 ? '#8E7C4F' : '#7C6B44'} opacity="0.5" />
          ))}

      {/* Walkway — cracked and swallowed by weeds before, clean pavers after */}
      <polygon points="470,700 660,700 606,400 560,400" fill={`url(#path-${uid})`} />
      {after ? (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = i / 6, t2 = (i + 1) / 6
            const lx = 470 + (560 - 470) * t, rx = 660 + (606 - 660) * t
            const lx2 = 470 + (560 - 470) * t2, rx2 = 660 + (606 - 660) * t2
            const y = 700 + (400 - 700) * t, y2 = 700 + (400 - 700) * t2
            return <polygon key={i} points={`${lx},${y} ${rx},${y} ${rx2},${y2 + 6} ${lx2},${y2 + 6}`}
                            fill="#E4DACB" stroke="#B3A991" strokeWidth="1.5" />
          })}
          {/* crisp edging either side */}
          <polygon points="462,700 470,700 560,400 555,400" fill="#7A5A3E" />
          <polygon points="660,700 668,700 611,400 606,400" fill="#7A5A3E" />
        </>
      ) : (
        <>
          {[560, 620, 480, 640, 520].map((y, i) => (
            <path key={i} d={`M${495 + i * 28} ${y} l38 -14 l22 18`}
                  stroke="#6E6857" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
          ))}
          {[500, 575, 630].map((y, i) => (
            <path key={`w${i}`} d={`M${540 + i * 30} ${y} q-6 -26 4 -44`}
                  stroke="#6F7A45" strokeWidth="4" fill="none" strokeLinecap="round" />
          ))}
        </>
      )}

      {/* Border shrubs — trimmed domes vs overgrown tangle */}
      {backShrubs.map((s, i) =>
        after ? (
          <g key={i}>
            <ellipse cx={s.x} cy={358} rx={s.r} ry={s.r * 0.78} fill="#35603C" />
            <ellipse cx={s.x - s.r * 0.25} cy={344} rx={s.r * 0.5} ry={s.r * 0.34} fill="#4A7C4E" opacity="0.75" />
          </g>
        ) : (
          <g key={i} className="sway" style={{ animationDelay: `${i * 0.6}s` }}>
            <path d={`M${s.x - s.r - 16} 372 q${s.r * 0.4} -${s.r * 1.5} ${s.r} -${s.r * 0.9}
                      q${s.r * 0.3} -${s.r * 0.8} ${s.r * 0.8} -${s.r * 0.2}
                      q${s.r * 0.6} -${s.r * 0.5} ${s.r * 0.9} ${s.r * 0.5} Z`}
                  fill="#5D6B41" />
            {[0, 1, 2, 3].map((k) => (
              <path key={k} d={`M${s.x - 20 + k * 16} 350 q-4 -34 ${k % 2 ? 10 : -8} -52`}
                    stroke="#6C7A48" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            ))}
          </g>
        )
      )}

      {/* Feature tree, left */}
      <g>
        <path d="M138 560 q10 -120 -6 -190 q22 44 34 6 q-6 76 8 184 Z" fill={after ? '#6B4A32' : '#6A6250'} />
        <g className="sway">
          {after ? (
            <>
              <circle cx="150" cy="300" r="92" fill="#3E7245" />
              <circle cx="98" cy="336" r="60" fill="#356240" />
              <circle cx="204" cy="332" r="64" fill="#47814C" />
              <circle cx="152" cy="262" r="56" fill="#54925A" opacity="0.85" />
            </>
          ) : (
            <>
              <circle cx="150" cy="300" r="86" fill="#77714F" />
              <circle cx="100" cy="338" r="52" fill="#6B6647" opacity="0.9" />
              <circle cx="200" cy="330" r="56" fill="#827A56" opacity="0.85" />
              <path d="M92 268 l-30 -34 M212 266 l32 -32 M150 214 l4 -40"
                    stroke="#6A6250" strokeWidth="5" strokeLinecap="round" />
            </>
          )}
        </g>
      </g>

      {/* Foreground: flower bed after, scattered debris + weeds before */}
      {after ? (
        <g>
          <path d="M880 640 q120 -48 258 -12 l0 72 -258 0 Z" fill="#6B4A32" />
          {[[920, 626], [975, 612], [1032, 606], [1090, 614], [1140, 628],
            [948, 650], [1005, 642], [1062, 640], [1118, 652]].map(([cx, cy], i) => (
            <g key={i}>
              <path d={`M${cx} ${cy + 16} q-3 -14 0 -20`} stroke="#3F7245" strokeWidth="3" strokeLinecap="round" />
              <circle cx={cx} cy={cy} r="9" fill={i % 3 === 0 ? '#C4703F' : i % 3 === 1 ? '#E0A077' : '#F0C98A'} />
              <circle cx={cx} cy={cy} r="3.2" fill="#8A4A24" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          {weeds.map(([x, y], i) => (
            <g key={i} className="sway" style={{ animationDelay: `${(i % 5) * 0.5}s` }}>
              <path d={`M${x} ${y} q-8 -30 2 -52`} stroke="#77804C" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d={`M${x} ${y} q10 -24 22 -38`} stroke="#69734A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d={`M${x} ${y} q-14 -20 -26 -30`} stroke="#828A5A" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ))}
          {[[300, 690], [760, 672], [1090, 686], [180, 640]].map(([cx, cy], i) => (
            <ellipse key={`d${i}`} cx={cx} cy={cy} rx="26" ry="9" fill="#7E7048" opacity="0.55" />
          ))}
        </g>
      )}
      </g>
    </svg>
  )
}
