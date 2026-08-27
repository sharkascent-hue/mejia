import { useState } from 'react'
import Reveal from './Reveal'

const services = ['Lawn maintenance', 'Landscape design', 'Hardscaping', 'Irrigation & lighting', 'Tree & shrub care', 'Something else']

export default function Quote() {
  const [picked, setPicked] = useState('Lawn maintenance')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true) // Front-end only — wire to your form handler or CRM.
  }

  return (
    <section id="quote" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[36px] bg-forest px-7 py-14 text-canvas sm:px-14 sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 h-96 w-96 rounded-full bg-fern/20 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <h2 className="text-4xl leading-[1.06] font-600 sm:text-5xl">
                  Tell us what is<br />bothering you about<br /><span className="italic text-clay-lt">your yard.</span>
                </h2>
                <p className="mt-6 max-w-md text-canvas/70">
                  We will walk the property, listen, and send a fixed written quote within 48 hours.
                  No pressure and no charge for the visit.
                </p>
                <div className="mt-9 space-y-4 border-t border-canvas/15 pt-8 text-sm">
                  {[['Call or text', '(813) 263-9442', 'tel:+18132639442'],
                    ['Email', 'hello@mejialandscaping.com', 'mailto:hello@mejialandscaping.com'],
                    ['Service area', 'Tampa · Brandon · Westchase · Carrollwood', null]].map(([k, v, href]) => (
                    <div key={k} className="flex flex-wrap gap-x-3">
                      <span className="w-28 shrink-0 text-canvas/50">{k}</span>
                      {href ? <a href={href} className="font-600 underline decoration-canvas/25 underline-offset-4 hover:decoration-canvas">{v}</a>
                            : <span className="font-500">{v}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {sent ? (
                <div className="rise grid place-items-center rounded-[26px] bg-canvas/10 p-10 text-center ring-1 ring-canvas/15">
                  <div>
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-clay text-canvas mx-auto">
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m4 12.5 5 5L20 6.5" />
                      </svg>
                    </span>
                    <h3 className="mt-6 text-2xl font-600">Got it — thank you.</h3>
                    <p className="mt-2 text-canvas/70">We will call you within one business day to book the walkthrough.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="rounded-[26px] bg-canvas p-7 text-ink shadow-soft sm:p-9">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" name="name" placeholder="Jane Doe" required />
                    <Field label="Phone" name="phone" type="tel" placeholder="(813) 555-0142" required />
                  </div>
                  <div className="mt-4">
                    <Field label="Property address" name="address" placeholder="123 Bayshore Blvd, Tampa" />
                  </div>

                  <fieldset className="mt-6">
                    <legend className="text-sm font-600 text-ink/75">What do you need?</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {services.map((s) => (
                        <button key={s} type="button" onClick={() => setPicked(s)} aria-pressed={picked === s}
                                className={`rounded-full px-4 py-2 text-sm font-500 transition-all
                                            ${picked === s ? 'bg-forest text-canvas shadow-soft'
                                                           : 'bg-sand/70 text-ink/70 hover:bg-sand'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="mt-6 block">
                    <span className="text-sm font-600 text-ink/75">Anything we should know?</span>
                    <textarea name="notes" rows="3" placeholder="The back corner floods every time it rains…"
                              className="mt-2 w-full resize-none rounded-2xl bg-sand/45 px-4 py-3 text-[0.95rem]
                                         ring-1 ring-ink/10 transition-shadow placeholder:text-ink/35
                                         focus:ring-2 focus:ring-forest focus:outline-none" />
                  </label>

                  <button type="submit"
                          className="mt-7 w-full rounded-full bg-clay px-8 py-4 text-sm font-600 text-white
                                     transition-transform hover:-translate-y-0.5 hover:bg-[#b0602f]">
                    Request my free estimate
                  </button>
                  <p className="mt-3 text-center text-xs text-ink/45">No spam, no door knocking. We call once.</p>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', placeholder, required }) {
  return (
    <label className="block">
      <span className="text-sm font-600 text-ink/75">{label}{required && <span className="text-clay"> *</span>}</span>
      <input type={type} name={name} placeholder={placeholder} required={required}
             className="mt-2 w-full rounded-2xl bg-sand/45 px-4 py-3 text-[0.95rem] ring-1 ring-ink/10
                        transition-shadow placeholder:text-ink/35 focus:ring-2 focus:ring-forest focus:outline-none" />
    </label>
  )
}
