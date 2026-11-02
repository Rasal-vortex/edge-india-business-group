# EDGE India website design guide

This guide records the visual language used by the homepage and provides reusable rules for new pages.

## Brand colors

- Primary navy: `#002069` for the footer, strong text, and primary dark surfaces.
- Primary blue: `#12358f` for buttons, links, focus rings, and active controls.
- Accent red: `#bb0013` for section rules, small eyebrow marks, and emphasis.
- Page background: `#f8f9ff`.
- Soft section surface: `#eff4ff`.
- Card surface: `#ffffff`.
- Main text: `#0b1c30`.
- Supporting text: slate 600; muted text: slate 400–500.
- Borders: slate 200, with slate 100 for subtle dividers.

Use solid colors for informational pages and cards. Reserve image overlays for photographic hero content.

## Typography

- Use Plus Jakarta Sans, already loaded by the root layout.
- Main section headings use 30–40 px, weight 800, tight tracking, and navy or main text.
- Body text uses 16 px with relaxed line height; supporting descriptions use slate 600.
- Eyebrows use 11 px, weight 800, uppercase, and 0.15–0.18em tracking, often preceded by a short red mark.
- Small labels and metadata use 11–13 px with clear contrast.

## Layout and spacing

- Center content in a `max-w-[1280px]` container.
- Use horizontal gutters `px-4 md:px-8 lg:px-12`.
- Sections use about 64 px vertical padding on mobile and 96 px on large screens.
- Keep headings and introductory copy in a readable `max-w-3xl` width.
- Use responsive grids that collapse to one column on small screens.

## Surfaces and shapes

- Use white cards with a 1 px slate 200 border, 12–16 px corner radius, and a light shadow.
- Alternate large sections with the page background or a pale blue surface.
- Use rounded-full shapes for category filters and compact metadata badges.
- Use rounded or modestly rounded rectangles for buttons and input controls.
- Keep cards clean and content-led; use borders and spacing to separate sections.

## Controls and interaction

- Primary actions use `#12358f` with white text and darken to `#002069` on hover.
- Secondary actions use a white surface, blue border or slate border, and blue text.
- Use the red accent for focus outlines and active section rules.
- Maintain visible keyboard focus and at least 40–48 px control height for touch targets.
- Use short color and transform transitions. Respect `prefers-reduced-motion`.

## Header and footer

- The homepage header uses the Edge India logo, compact navigation, and a translucent glass surface after scrolling.
- The site footer uses a deep navy background, a 2 px red top rule, the Edge India logo on a white tile, and muted white text.
- Preserve the Vortex AI & Tech Solution attribution and its logo where a page-specific attribution is required.

## Member profile pages

- Keep the company and representative information together in a single page.
- Use the same light page background, navy headings, white bordered cards, and blue primary actions.
- Put the company logo and name before the representative photo, name, and designation.
- Group contact actions and company details into clearly labeled sections.
- Keep phone, email, social, website, and directions actions touch-friendly and responsive.
- Show maps in a bordered responsive iframe with a separate Directions action.
