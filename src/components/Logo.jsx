export default function Logo({ className = '', mono = false }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true">
        <rect x="1.5" y="1.5" width="45" height="45" rx="14"
              fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.28" />
        {/* M monogram drawn as three grass blades */}
        <path d="M11 37 V19 L24 31 L37 19 V37"
              fill="none" stroke="currentColor" strokeWidth="4.4"
              strokeLinecap="round" strokeLinejoin="round" />
        {/* leaf sprouting from the valley of the M */}
        <path d="M24 30 C24 22 27.5 17 33 14 C32 21 29 27 24 30 Z"
              fill="currentColor" opacity="0.9" />
        <path d="M24 30 C24 24 21.5 20 17 18 C18 23.5 20.5 28 24 30 Z"
              fill="currentColor" opacity="0.55" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.35rem] font-600 tracking-tight">Mejia</span>
        <span className={`block text-[0.6rem] font-600 uppercase tracking-[0.28em] ${mono ? 'opacity-70' : 'text-moss'}`}>
          Landscaping
        </span>
      </span>
    </span>
  )
}
