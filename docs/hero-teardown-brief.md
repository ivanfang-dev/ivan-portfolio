# Design Brief — "The Teardown" (hero + flagship, one sequence)

Confirmed 2026-07-19. Implementation runs with the rebrand pass (typeset + colorize), Phase A first.

## 1. Feature Summary
The hero and the LionCity flagship case study fuse into one scroll-driven story. On load, LionCity's UI assembles itself beside the name; on scroll, it pins and pulls apart layer by layer (AirPods-teardown mechanic), each layer carrying one line of engineering story; it lands on an interactive Telegram-bot beat and reassembles over the outcome metrics. This IS the case study — no separate flagship section.

## 2. Primary User Action
Scroll. A passive recruiter who only scrolls still receives the full story in ~5 beats.

## 3. Design Direction
- Color strategy: **Committed** UCLA blue; light theme (recruiter on a bright laptop between interview loops).
- Ships together with the rebrand (new typeface + color + lion mark). Typeface owned by the typeset pass (shortlist: Bricolage Grotesque, Cabinet Grotesk).
- Anchors: AirPods teardown *mechanic* (storytelling device, not Apple's skin); Stripe press-page clarity for the text rail; LionCity's own product branding inside the layers — the app should look like itself, proving it's real.

## 4. Scope
Production-ready. Phased:
- **Phase A (~1 week):** assembly entrance + 5 pinned scroll beats with stylized static layer art. Ships alone.
- **Phase B (~1 week):** beat 4 becomes a live, typeable bot simulation. Upgrades in place.

## 5. Layout Strategy
Fold: two zones — left, identity stack (name / claim / proof chips / Resume link); right, the stage where UI fragments (search bar, tutor card, star rating, WhatsApp button) snap into the assembled app. On first scroll the text rail yields, the stage pins center via `position: sticky`, and scroll progress scrubs the teardown:

| Beat | Stage | Caption |
|---|---|---|
| 1 | Frontend layer peels off | "The storefront. Next.js, shipped in 3 weeks." |
| 2 | Matching engine exposed | "100+ requests matched in the first 3 months." |
| 3 | Data layer | "One schema serving parents, tutors, and admins." |
| 4 | Telegram bot slides in | "150+ tutors run by a bot I wrote — try it." (interactive in Phase B) |
| 5 | Layers snap back → metrics overlay | "300+ families. Tutor search: weeks → hours." + [Visit live site] [GitHub] |

After beat 5 the pin releases; page resumes normally (other projects → timeline → about → contact).

## 6. Key States
- **Assembly:** completes instantly if the user scrolls, or under `prefers-reduced-motion`.
- **Reduced motion:** whole sequence renders as a static stacked layer diagram with all five captions — full story, no pinning.
- **Mobile:** stage scales to a shallow band above the captions; same sticky mechanic; fragments smaller, type unchanged.
- **Bot beat offline / Phase A:** scripted autoplay loop, honestly labeled "a simulation of the real bot."
- **Accessibility:** captions are real headings in DOM order; visual stage is `aria-hidden` duplication; every beat keyboard-reachable.

## 7. Interaction Model
Native scroll only — no wheel hijacking, no forced duration; scrub is bidirectional. Nav links and a quiet "skip the story ↓" anchor jump past the sequence. Phase B bot: tap suggested chips (`/match`, "Need a P5 math tutor") or type freely against a scripted response tree. Magnetic hover reserved for the two CTAs at beat 5.

## 8. Content Requirements
- Claim under the name: **"I built this."** — the teardown finishes the sentence.
- Chips: `Founder · LionCity Tutors` / `SDE Intern '26 · Amazon` / `CS · UCLA`.
- Captions as tabled — **verify every number** (100+ requests, 150+ tutors, 300+ families, "3 weeks") against reality before ship.
- Layer art: stylized DOM/SVG recreations of LionCity's actual screens (not raster screenshots — they must split into layers), built once as components.
- Bot script: ~8-node response tree drafted from real bot transcripts.
- Retired: the four typewriter taglines ("I love anything software 💙💛" may live on in About's voice).

## 9. Engineering Constraints
No canvas frame-sequences, no WebGL. `position: sticky` pinning + framer-motion `useScroll`/`useTransform` on DOM/SVG layers (already in the stack). Budget ≤50KB added JS; layer art as inline SVG. Assembly done ≤1.5s; 60fps scrub (transform/opacity only).

## 10. References for Implementation
`animate.md` (scrub choreography), `layout.md` (pinned stage + caption rail), `typeset.md` / `colorize.md` (the rebrand this ships with).
