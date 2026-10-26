---
name: Lyrics
description: A personal songbook. Warm paper, soft black type, nothing between you and the words.
colors:
  bone: "#fbfaf7"
  soft-black: "#1a1a1a"
  warm-stone: "#6e6a62"
  hairline: "#e8e5dd"
  warm-wash: "#f3f0e8"
typography:
  display:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    fontSize: "42px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    letterSpacing: "-0.01em"
  brand:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 500
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.005em"
  body-sm:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  nav:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    letterSpacing: "0.01em"
  label:
    fontFamily: "Noto Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  gutter-mobile: "16px"
  gutter: "32px"
  row-y: "18px"
  row-y-mobile: "22px"
  section: "48px"
  page-top: "56px"
  page-bottom: "120px"
components:
  search-input:
    backgroundColor: "transparent"
    textColor: "{colors.soft-black}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "16px 0 16px 36px"
  song-row:
    textColor: "{colors.soft-black}"
    typography: "{typography.title}"
    padding: "22px 12px 22px 0"
  song-row-hover:
    backgroundColor: "{colors.warm-wash}"
    padding: "18px 24px 18px 12px"
  back-link:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.warm-stone}"
    typography: "{typography.nav}"
    height: "52px"
    padding: "0 16px"
  back-link-hover:
    textColor: "{colors.soft-black}"
  lyrics-body:
    textColor: "{colors.soft-black}"
    typography: "{typography.body}"
  section-marker:
    textColor: "{colors.warm-stone}"
    typography: "{typography.label}"
---

# Design System: Lyrics

## Overview

**Creative North Star: "The Quiet Page"**

Everything steps back so the words sit alone on warm paper. The system has one surface (Bone), one ink (Soft Black), one secondary voice (Warm Stone), and hairline rules to separate things. It uses no boxes, no shadows, no rounded corners and no accent colour. Hierarchy comes from type size and weight only, and the interface reads more like a typeset page than an app.

Density is low and the rhythm is generous: one narrow column (760px max), wide vertical spacing, and list rows tall enough to tap easily. On phones the type gets *larger*, not smaller, because the reader holds the phone at arm's length while singing. Controls are calm and precise: restrained in form, but carried by exact small details like the 12px hover indent on song rows, the 1.25px icon strokes and the tight negative tracking on large type.

**Key Characteristics:**
- Designed for the phone first and above all, specifically iOS Safari. Desktop is the secondary layout.
- Monochrome warm palette, no accent colour
- Flat: depth is never simulated, and hairlines do all the separating
- Square corners everywhere
- One sans family (Noto Sans) at a few weights, with negative tracking on large sizes
- Mobile type scales up below 540px
- Motion limited to 120ms colour and padding transitions

## Colors

A warm, near-monochrome palette: paper, ink, and three tints between them.

### Neutral
- **Bone** (`bone`): the only surface. Page background, the sticky back bar's fill, the PWA theme and splash colour.
- **Soft Black** (`soft-black`): all primary text (song titles, lyrics, the search query) plus the search field's underline and the brand dot. It's a slightly softened black, never pure #000.
- **Warm Stone** (`warm-stone`): secondary information. Artist names in the list, result counts, uppercase labels, lyric section markers, the search placeholder and icon, the back link at rest, the footer. Contrast is 5.2:1 on Bone and 4.7:1 on Warm Wash. It was darkened from #8a8780 (3.4:1) to meet WCAG AA, so don't lighten it again.
- **Hairline** (`hairline`): 1px dividers between list rows, the footer rule, and the back bar's bottom edge on mobile.
- **Warm Wash** (`warm-wash`): the hover fill on song rows. Barely darker than Bone.

### Named Rules
**The No-Accent Rule.** The palette has no brand or accent colour. Emphasis comes from Soft Black against Warm Stone, or from size and weight. A new colour must earn its place against the principle "Words first".

**The Two-Voice Rule.** Text is either Soft Black (content) or Warm Stone (metadata, labels, chrome). No third text colour.

## Typography

**Display Font:** Noto Sans (falls back to ui-sans-serif, system-ui, -apple-system, Helvetica Neue, Arial)
**Body Font:** Noto Sans
**Weights loaded:** 300 (placeholder only), 400, 500. Nothing else is fetched.

**Character:** A neutral, highly legible humanist sans. It is set in a slightly editorial way: medium weight and tight tracking for anything large, generous line height for lyrics. Stylistic sets `ss01` and `cv11` are on globally.

**Implementation:** each role is a utility in `src/index.css` (`type-display`, `type-search`, `type-brand`, `type-title`, `type-lyrics`, `type-meta`, `type-nav`, `type-label`). The phone size is the base, and the `wide:` variant (540px and up) adjusts it. Use these utilities instead of arbitrary `text-[…]` sizes.

### Hierarchy
Sizes are listed as phone → wide.
- **Display** (500, 42px → 44px, line-height 1.05, −0.025em, balanced wrap): the song title on the lyrics view, plus the "not found" and error headings.
- **Headline** (400, 30px → 28px, −0.01em): the search field's text. The placeholder drops to weight 300 in Warm Stone.
- **Brand** (500, 26px → 22px, −0.02em): the "Lyrics" wordmark (the list page's `h1`) followed by a 6px Soft Black dot.
- **Title** (500, 22px → 19px, line-height 1.25, −0.01em, balanced wrap): song titles in the list.
- **Body** (400, 22px / 1.45 → 20px / 1.5, −0.005em): lyrics. Full column on the phone, 580px max on wide screens. See the Lyrics Body component for line and stanza handling.
- **Body small** (400, 16px → 14px): artist names, empty, error and loading messages.
- **Nav** (400, 17px → 14px, +0.01em): the "All songs" back link.
- **Label** (400, 12px, +0.08em, uppercase, tabular figures): the song count, the "Artist" label and lyric section markers.

### Named Rules
**The Grow-on-Mobile Rule.** The phone sizes are the larger ones: titles are 22px against 19px on wide screens, lyrics 22 against 20, artist 16 against 14, back link 17 against 14. Never shrink type for small screens.

**The Tight-Large, Loose-Small Rule.** Tracking goes negative as size goes up (−0.025em on display) and positive on small uppercase labels (+0.06–0.08em).

## Layout

A single centred column, `max-width: 760px`, with 32px side gutters (16px on mobile). Pages open with 56px top padding (24px on mobile) and end with 120px bottom padding (80px on mobile).

- **Breakpoint:** one, at 540px. Below it, gutters shrink, type grows, and list rows stack the artist under the title instead of right-aligning it.
- **Song list:** full-width rows split by Hairline. The desktop grid is `1fr auto` (title left, artist right-aligned with no wrapping), with a 24px gap and 18px vertical padding (22px on mobile).
- **Lyrics view:** a sticky back bar at the top, then a 48px header gap and the lyrics block. On mobile the back bar runs edge to edge (cancelling the gutter) with a Hairline bottom border and a 52px minimum height.
- **Footer:** an 80px top margin, a Hairline rule, and a small lowercase "lyrics" in Warm Stone.

### Named Rules
**The Phone-First Rule.** This site is designed first and foremost for a phone. Design every screen and component at phone width (about 360–430px) first. The phone values here (16px gutters, 22px rows, 52px back bar, enlarged type) are the primary spec, and the desktop layout is an adaptation of them. Interactive targets are at least 44px tall, and nothing scrolls sideways. Hover effects are extras for desktop; no feature may depend on hover. A change is not done until it has been checked at phone width.

Code is written mobile-first: phone styles are the base, and the `wide:` variant (540px and up, defined as `--breakpoint-wide` in `src/index.css`) adds the desktop layout. Don't write `max-[540px]:` overrides.

**The iOS Safari Rule.** The primary browser is Safari on iPhone, both in a tab and installed to the Home Screen. When a choice has to favour one browser, it favours iOS Safari. Specifically:
- The viewport uses `viewport-fit=cover`, and `body` pads by `env(safe-area-inset-*)` so content clears the notch, Dynamic Island and home indicator in portrait and landscape. Any new fixed or sticky element must respect the safe areas too.
- Text inputs are at least 16px, otherwise Safari zooms the page on focus. The search field is 30px.
- Safari's default form styling is reset (`appearance: none` on search inputs). Native behaviours iOS users rely on stay: the search field's clear button, the `search` return key, and swipe-back navigation through real `history` entries.
- Hover is never required. Tailwind's `hover:` only applies on devices that support hover, and touch gets an `active:` state instead.
- The tap highlight is off (`-webkit-tap-highlight-color: transparent`) because `active:` states replace it, and `text-size-adjust` is locked so rotating the phone doesn't rescale text.
- `theme-color` is Bone, so Safari's toolbars blend with the page.
- The Home Screen uses `apple-touch-icon.png` (180px, square, full-bleed Soft Black, because iOS applies its own rounded mask) and the title "Lyrics", with the status bar style `default`.
- Use `dvh`/`svh` rather than `vh` for any full-height layout, because Safari's toolbars resize the viewport.
- Offline matters on iOS: the service worker caches the Google Font as well as the app, so type doesn't fall back to San Francisco without a connection.

## Elevation & Depth

Fully flat. The system has no shadows, blur or overlapping layers. The only thing that sits above the page is the sticky back bar, and it is separated by a solid Bone fill, plus a Hairline border on mobile, rather than a shadow.

### Named Rules
**The Hairline-Not-Shadow Rule.** Separation is a 1px Hairline or Soft Black rule. If something needs to read as raised, the answer is a rule or a fill change, never a shadow.

## Shapes

Square corners throughout (`rounded.none`). There are no cards, pills, chips or containers, so the only shapes are horizontal rules and text. Icons are hand-drawn inline SVGs with 1.25px strokes and round caps: a search magnifier and a left arrow. The one round element is the 6px brand dot.

## Components

Calm and precise. Controls look like typography and rules rather than widgets.

### Focus and Selection
- **Focus ring:** a 2px Soft Black outline drawn just inside the element's edge (`outline-offset: -2px`), shown only for keyboard focus (`:focus-visible`), so it's never clipped by rows or the sticky bar.
- **Selection:** a Hairline background with Soft Black text. **Caret:** Soft Black.

### Inputs / Fields
- **Search field:** borderless except for a 1px Soft Black underline, with square corners even on iOS. Transparent background, Headline type, the magnifier icon in Warm Stone 2px from the left, and 36px left padding to clear it. It has an accessible label of "Search by song or artist", autocorrect and spellcheck are off, and the return key reads "Search".
- **Focus:** keyboard focus thickens the underline to 2px, with padding compensating so the height doesn't change. The field auto-focuses on load unless returning to a scrolled list position.
- **Placeholder:** "Song or artist", in Warm Stone at weight 300. It's kept short so it fits at 30px on a 375px phone without clipping. The full wording lives in the accessible label.

### Navigation
- **Back link ("All songs"):** on the phone, a full-width 52px tap bar with an arrow icon and Nav type, Warm Stone at rest and Soft Black when pressed. On wide screens it is an inline text button at least 44px tall, turning Soft Black on hover (120ms).
- **Brand masthead:** the "Lyrics" wordmark and dot, top left of the list page and the page's `h1`. It is not interactive.

### Song Row (signature component)
- **Rest:** title (Title, Soft Black) and artist (Body small, Warm Stone) separated by a Hairline below.
- **Phone:** stacked, 4px gap, 22px vertical padding. A press shows the Warm Wash fill.
- **Wide:** title left and artist right, 18px vertical padding. On hover the Warm Wash fill appears and the content slides in 12px from the left (padding 0→12px left, 12→24px right) over 120ms ease.

### Lyrics Body (signature component)
- **Lines:** each source line is its own block with a 1em **hanging indent**. When a long line wraps on a phone, the continuation is indented under the first word, so it can't be mistaken for a new line when glanced at mid-song. Wrapped lines use `text-wrap: pretty`.
- **Stanzas:** blank lines in the source start a new stanza, spaced 0.9em apart. Runs of blank lines collapse into one gap.
- **Section markers:** a line that is only `[Chorus]`, `[Verse 2]` and so on is drawn as a Label in Warm Stone without the brackets, above its stanza.
- **States:** "Loading…" in Warm Stone. If the fetch fails, "Couldn't load these lyrics. Check your connection and try again."

### Count Label and Empty States
- **Count:** uppercase Label in Warm Stone, "N songs" or "N of M songs" when filtered. Screen readers announce changes (`aria-live="polite"`), and the line keeps its height even when empty.
- **No matches:** centred Body small in Warm Stone, "No songs match that.", with 64px vertical padding.
- **List failed to load:** the same treatment, "Couldn't load the song list. Check your connection and reload."
- **Deep link before the index loads:** shows "Loading…", never a brief "Song not found".

## Do's and Don'ts

### Do:
- **Do** design and check every change at phone width first (about 360–430px), for iOS Safari above all. Desktop comes second.
- **Do** use the `type-*` role utilities and the `wide:` variant instead of arbitrary sizes and `max-[540px]:` overrides.
- **Do** keep new fixed or sticky elements clear of the iOS safe areas.
- **Do** keep everything on Bone with Soft Black and Warm Stone text. Use Warm Wash only for hover and Hairline only for 1px rules.
- **Do** make type larger, never smaller, below the 540px breakpoint.
- **Do** separate items with 1px Hairline rules and space, not containers.
- **Do** use negative tracking on type 19px and above, and positive tracking on small uppercase labels.
- **Do** keep transitions to colour and padding at about 120ms ease.
- **Do** draw icons as inline SVG with 1.25px round-capped strokes in `currentColor`.

### Don't:
- **Don't** add an accent or brand colour, gradients, or pure black (#000) / pure white (#fff) surfaces.
- **Don't** add shadows, blur, or rounded corners.
- **Don't** wrap content in cards, boxes or pills.
- **Don't** introduce a second typeface or weights above 500 in the interface.
- **Don't** make any text input smaller than 16px (iOS Safari zooms on focus) or rely on hover for anything.
- **Don't** use sample lyric text in mockups or component examples. Use neutral placeholders.
