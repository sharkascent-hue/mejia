import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-sand/40 py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <span className="text-forest"><Logo /></span>
            <p className="mt-5 text-sm leading-relaxed text-ink/60">
              Design, build and year-round care for Tampa Bay yards. Licensed and insured.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-8 text-sm sm:gap-16">
            <div>
              <h3 className="font-display text-base font-600 text-forest">Company</h3>
              <ul className="mt-4 space-y-2.5 text-ink/60">
                {[['Services', '#services'], ['Our work', '#work'], ['Process', '#process'], ['Reviews', '#reviews']].map(([l, h]) => (
                  <li key={h}><a href={h} className="transition-colors hover:text-forest">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-600 text-forest">Contact</h3>
              <ul className="mt-4 space-y-2.5 break-words text-ink/60">
                <li><a href="tel:+18132639442" className="transition-colors hover:text-forest">(813) 263-9442</a></li>
                <li><a href="mailto:hello@mejialandscaping.com" className="transition-colors hover:text-forest">hello@mejialandscaping.com</a></li>
                <li>Mon–Sat, 7am–6pm</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-7 text-xs text-ink/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Mejia Landscaping LLC. All rights reserved.</p>
          <p>Tampa · Brandon · Westchase · Carrollwood · Seminole Heights</p>
        </div>
      </div>
    <div className="almlab-credit-row" style={{display:'flex',justifyContent:'center',padding:'12px 16px 4px'}}><a className="almlab-credit" href="https://almlabmarketing.com" target="_blank" rel="noopener" aria-label="Website by AlmLab" style={{display:'inline-flex',alignItems:'center',gap:'3px',color:'rgba(0,0,0,.55)',fontSize:'11px',letterSpacing:'.06em',lineHeight:'1',textDecoration:'none',whiteSpace:'nowrap'}}><span>Website by</span><img src="https://almlabmarketing.com/almlab-credit-dark.png" alt="AlmLab" width="74" height="28" loading="lazy" style={{height:'28px',width:'auto',display:'block'}} /></a></div>
      </footer>
  )
}
