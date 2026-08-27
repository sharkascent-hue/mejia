import { useEffect, useState } from 'react'
import Logo from './Logo'

const links = [
  ['Services', '#services'],
  ['Our Work', '#work'],
  ['Process', '#process'],
  ['Reviews', '#reviews'],
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
                        ${solid ? 'bg-canvas/85 shadow-[0_1px_0_rgba(18,26,20,0.08)] backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className={solid ? 'text-forest' : 'text-canvas'}><Logo mono={!solid} /></a>

        <div className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href}
               className={`text-sm font-500 transition-colors ${solid ? 'text-ink/70 hover:text-forest' : 'text-canvas/80 hover:text-canvas'}`}>
              {label}
            </a>
          ))}
          <a href="tel:+18132639442"
             className={`text-sm font-600 transition-opacity hover:opacity-70 ${solid ? 'text-forest' : 'text-canvas'}`}>
            (813) 263-9442
          </a>
          <a href="#quote"
             className={`rounded-full px-6 py-3 text-sm font-600 shadow-soft transition-transform hover:-translate-y-0.5
                         ${solid ? 'bg-forest text-canvas hover:bg-moss' : 'bg-canvas text-forest'}`}>
            Free Estimate
          </a>
        </div>

        <button type="button" onClick={() => setOpen((o) => !o)}
                aria-expanded={open} aria-label="Toggle navigation"
                className={`grid h-11 w-11 place-items-center rounded-full md:hidden
                            ${solid ? 'ring-1 ring-ink/15 text-forest' : 'ring-1 ring-canvas/30 text-canvas'}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-canvas px-5 pb-6 md:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
               className="block border-b border-ink/5 py-4 text-base font-500 text-ink/80">
              {label}
            </a>
          ))}
          <a href="#quote" onClick={() => setOpen(false)}
             className="mt-5 block rounded-full bg-forest px-6 py-4 text-center text-sm font-600 text-canvas">
            Free Estimate
          </a>
        </div>
      )}
    </header>
  )
}
