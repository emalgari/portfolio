# The Atelier

This is my portfolio. I built it by hand, on purpose.

A lot of portfolio sites are the same template with a different name bolted on. I wanted mine to be the kind of site I would actually want to hire, so everything here is written from scratch: the background, the scrolling, the cursor, the little pen marks in the margins.

## What's on the page

The landing page is one long take:

- A WebGL background written from scratch. Threads of light that part around your cursor. It's about 150 lines of math, no library tricks.
- Smooth scrolling (Lenis) synced with GSAP, so the pinned horizontal project gallery doesn't stutter.
- Hand-drawn underlines, circles and arrows that draw themselves in as you scroll. I wanted the page to feel like someone actually made it, because someone did.
- A custom cursor, film grain, and a few details you'll probably notice on the second visit, not the first.

The project frames are placeholders right now. I'm finishing case studies and linking them as they're ready.

## Stack

HTML, custom CSS and vanilla JS, with Three.js for the background, GSAP + ScrollTrigger for scroll work, Lenis for smooth scrolling, and Tailwind from the CDN for utility classes.

Yes, I know Tailwind's CDN isn't how you ship an app. For a static portfolio it's fine, and everything custom lives in `styles.css`.

## How it's organized

```
portfolio/
├── index.html     the landing page
├── styles.css     all custom CSS, commented
├── app.js         background, cursor, gallery, animations
└── work/          one folder per project, each with its own page
```

## Running it locally

Any static server works.

```
npx serve
```

or

```
python3 -m http.server
```

## Adding a project

Open `app.js`, find the `projects` array, flip `comingSoon` to `false` and point `href` at the folder. That's the whole workflow.

## The boring-but-important stuff

- Responsive down to 320px. On phones the gallery becomes a normal swipe carousel, because pinning horizontal scroll on touch feels wrong.
- If your OS asks for reduced motion, the site listens. Everything shows, nothing moves.
- I try to keep it at 60fps. If your machine disagrees, tell me.

## A note on the code

I commented the *why*, not just the *what*. If you read through and something still feels unclear, that's a bug. Email me and I'll explain it, and probably fix the comment while you're at it.

## Contact

- emalgari@proton.me
- github.com/emalgari

Saddam