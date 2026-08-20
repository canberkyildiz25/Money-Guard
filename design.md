# Design — Money Guard

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## The idea

A **defter** — an account book. Not a SaaS dashboard, not a fintech landing page.
Personal finance is a thing people have kept on ruled paper for centuries, and
the page should read as the descendant of that object: safety-tinted stock,
iron-gall ink, ruled lines, and amounts that align in a column because a ledger
is unreadable when they don't.

Everything below follows from that. Where a choice could go either way, the one
that reads as *printed record* wins over the one that reads as *product page*.

## Genre

editorial

## The colour constraint that shapes everything

In a finance app **red and green are already taken** — they mean expense and
income, and the user reads them as data, not decoration. A brand accent in
either hue collides with that meaning and makes the figures ambiguous.

Violet and indigo are ruled out by project standing order. Teal is spent on a
sibling project and repeating it would make the two read as one.

So the accent is **tobacco** — ledger binding and stamp ink. It is warm, it is
dark, it is nowhere near the semantic pair, and it comes out of the subject.

The consequence, stated plainly: **the only saturated colour on a page is the
money itself.** Income green and expense red appear on figures and nowhere else
— never as a decorative fill, never as a section background, never on a button.
That is the system's single strongest rule.

## Theme

- `--color-paper`   oklch(0.972 0.012 92)   /* safety-tint straw, not white */
- `--color-paper-2` oklch(0.945 0.014 90)   /* ruled band, table zebra */
- `--color-paper-3` oklch(0.915 0.016 88)   /* wells, inset fields */
- `--color-ink`     oklch(0.22 0.015 60)    /* warm near-black, iron-gall */
- `--color-ink-2`   oklch(0.44 0.012 62)    /* secondary text */
- `--color-ink-3`   oklch(0.515 0.011 64)   /* labels, captions — graded 4.5:1 on paper-2, the darkest surface it lands on */
- `--color-rule`    oklch(0.87 0.013 88)    /* hairlines */
- `--color-accent`  oklch(0.44 0.075 62)    /* tobacco */
- `--color-accent-hover` oklch(0.38 0.080 60)
- `--color-accent-ink`   oklch(0.972 0.012 92)
- `--color-focus`   oklch(0.44 0.075 62)

Semantic, reserved — figures only:

- `--color-income`  oklch(0.46 0.10 150)
- `--color-expense` oklch(0.46 0.13 25)

Accent coverage stays under 5 % of any viewport.

## Typography

- Display: Fraunces, weight 600, style normal. Roman only — no italic headers.
- Body:    IBM Plex Sans, weight 400 / 500
- Figures: IBM Plex Mono, weight 400 / 500 — **tabular-nums always**
- Display tracking: -0.02em
- Type scale anchor: `--text-display` = clamp(2.5rem, 6vw, 4.25rem)

Every currency amount, date, percentage, and account number is set in
IBM Plex Mono with `font-variant-numeric: tabular-nums`. This is not a stylistic
flourish: a column of amounts in a proportional face does not align, and a
ledger that does not align is a ledger you cannot scan.

## Spacing

4-point named scale. Values live in `tokens.css`. Pages use named tokens
(`var(--space-md)`), never raw values.

## Motion

- Easings: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1)
- Reveal pattern: none. A ledger does not animate into view.
- Interaction motion only: press, hover, modal enter/exit.
- Reduced-motion fallback: opacity-only, ≤ 150 ms.

## Microinteractions stance

- Silent success. A saved transaction appears in the table; it does not toast.
- Destructive actions: optimistic update + Undo, never a confirm dialog for
  anything reversible.
- Hover tooltip delay 800 ms · focus tooltip delay 0 ms.

## CTA voice

- Primary: solid tobacco fill, 2px radius, IBM Plex Sans 500, sentence case.
  Copy is a verb the user would say: "Hesap aç", "İşlem ekle" — never
  "Ücretsiz Başla" or "Hemen Başlayın", which are advertising, not instruction.
- Secondary: hairline outline on paper, same geometry.

## Per-page allowances

- Marketing (`/`) MAY use enrichment — Tier-A CSS art only.
- App pages (`/dashboard`, `/statistics`, `/currency`) MUST NOT. Function
  carries the page.
- Auth (`/login`, `/register`): typography only.

## Macrostructure families

- Marketing pages: **Letter** — a direct written address. No stat bar; the
  product has no real usage numbers and inventing them is forbidden.
- App pages: **Workbench** — dense, tool-shaped, no hero.
- Auth pages: single ruled column, form on paper.

## What pages MUST share

- The wordmark, set in Fraunces.
- The accent and its ≤ 5 % budget.
- The three faces and the tabular-figure rule.
- The CTA voice: 2px radius, solid tobacco, sentence-case verb.
- Rules are hairlines in `--color-rule`, never shadows, for separating rows.

## What pages MAY differ on

- Macrostructure within the family.
- Hero archetype on marketing.
- Whether a table is zebra-striped or hairline-ruled.

## Bans, specific to this project

- No gradient of any kind, on any surface, including text.
- No emoji as an icon, anywhere.
- No drop shadows for elevation — hairlines and paper steps only.
- No re-drawn browser or phone chrome (traffic-light dots, URL pills).
- No blurred colour blobs behind the hero.
- No evenly-weighted feature-card row of three or four.
- No invented metrics, testimonials, or logo walls.
- Inter and Poppins are removed from the project and must not return.
