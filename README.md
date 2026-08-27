# Mejia Landscaping

Marketing site for a Tampa Bay landscaping company. React + Vite + Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Design

Direction came from the `ui-ux-pro-max` skill's `nature-distilled` / `organic-biophilic`
styles — earthy and muted rather than the usual bright-green landscaping look.

- **Palette** — forest `#1E3A29`, moss `#3B6B4A`, sand `#E7DDCC`, cream `#F7F4ED`,
  terracotta accent `#C4703F`. Defined as Tailwind theme tokens in `src/index.css`.
- **Type** — Fraunces (display) + DM Sans (body).
- **Logo** — original SVG monogram in `src/components/Logo.jsx`; an "M" drawn as grass
  blades with a leaf in the valley. Favicon is the same mark (`public/favicon.svg`).

## The scroll build

`ScrollBuild.jsx` is the showpiece: a pinned section where scroll position drives a deck
being built in the yard, one stage at a time — bare yard, layout strings, base and
footings, framing, decking, rails and steps, fence, then planting and lighting at dusk.

It is not a video or an image sequence. The whole scene is SVG and every stage is driven
by a single 0→1 progress value, so it weighs nothing and stays sharp at any size. Scroll
listening is passive and rAF-throttled, progress is quantised to 1/500 so React only
re-renders on a visible change, and the sky/house/lawn layers are memoised out of the
update path entirely.

Under `prefers-reduced-motion` the section drops its pinned height and renders the
finished yard as a static image.

## The before/after hero

`BeforeAfter.jsx` (in the hero) is a draggable before/after comparison of the same yard. Both states are
drawn as SVG in `YardScene.jsx` on identical geometry, so the wipe lines up exactly. There
are no photographs anywhere in this site — swap in real project photos when you have them.

Supported input: pointer drag, touch, and keyboard (arrows, shift+arrows, Home/End) with
`role="slider"` and live `aria-valuetext`. A one-off nudge animation on load signals that
the control is draggable; it is skipped under `prefers-reduced-motion`.

`YardScene` takes a `seed` prop (0–3) that mirrors the layout and varies the mow direction,
sun position, tree placement and greens, so the four project cards read as four yards.

## Not wired up

The quote form in `Quote.jsx` is front-end only — it shows a success state without sending
anything. Point `submit()` at your form handler or CRM before launch. Phone number, email
and service areas are placeholders.
