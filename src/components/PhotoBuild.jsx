import { useRef, useState } from 'react'
import { useScrollProgress, useMedia, easeOut } from '../lib/scroll'
import HeroOverlay from './HeroOverlay'

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ecce44mke0LAFhuakx5m04bD91'

/* Fallback hero when the build video is unreachable: the same garden in five
   photographs, stacked and faded in cumulatively. Stages 1-4 were generated
   from stage 0 as the reference frame, so only the fence changes. */
const STAGES = [
  { file: 'hf_20260825_201414_a3c505aa-aae1-4a46-a395-9bb7b929d9f0.png', label: 'The garden as it is', note: 'Open boundary, nothing built' },
  { file: 'hf_20260825_201956_d1562c16-4428-4f2e-9e86-8f2e1f512911.png', label: 'Posts set', note: 'Dug, plumbed and concreted in' },
  { file: 'hf_20260825_201956_90d65b47-1fd3-47ae-8b30-7205e3520d7f.png', label: 'Rails up', note: 'The frame that carries the run' },
  { file: 'hf_20260825_201955_1c2bd510-0163-4ecf-9fbc-8b8b6981fbcc.png', label: 'Boards going on', note: 'Cladding works left to right' },
  { file: 'hf_20260825_201955_2079f640-4e89-4353-9280-0d919d06f1c9.png', label: 'Finished fence', note: 'Cedar, squared up, built to stand' },
]

export default function PhotoBuild() {
  const wrap = useRef(null)
  const p = useScrollProgress(wrap)
  const small = useMedia('(max-width: 640px)')
  const still = useMedia('(prefers-reduced-motion: reduce)')
  const [broken, setBroken] = useState(false)

  const t = still ? 1 : p
  const pos = easeOut(t) * (STAGES.length - 1)
  const idx = Math.min(STAGES.length - 1, Math.round(pos))
  const stage = STAGES[idx]

  return (
    <section ref={wrap} id="top" className="relative bg-forest"
             style={{ height: still ? '100vh' : small ? '300vh' : '380vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {STAGES.map((s, i) => (
          <img key={s.file} src={`${CDN}/${s.file}`}
               alt={i === 0 ? 'Garden before the fence was built' : ''}
               aria-hidden={i > 0}
               onError={() => i === 0 && setBroken(true)}
               className="absolute inset-0 h-full w-full object-cover"
               style={{ opacity: i === 0 ? 1 : Math.min(1, Math.max(0, pos - (i - 1))) }} />
        ))}
        {/* Even fully offline the hero keeps its ground colour */}
        {broken && <div className="absolute inset-0 bg-forest" />}

        <div aria-hidden="true"
             className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/45" />

        <HeroOverlay t={t} still={still} captionTitle={stage.label} captionNote={stage.note} />
      </div>
    </section>
  )
}
