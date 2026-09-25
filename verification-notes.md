# SmartCart verification notes

The desktop hero rendered cleanly at 1280 × 720, including navigation, the editorial headline, CTA buttons, Unsplash produce image, and basket mockup. The mobile hero also rendered cleanly at 390 × 844, with a compact navigation toggle, readable typography, and responsive controls.

The live preview contains the problem/solution comparison, five shopping steps, hardware and security panel, reminder card, journey introduction, seven supplied timeline milestones, CTA section, and footer. Browser interaction revealed duplicate `journey` IDs between the intro and the supplied timeline. The duplicate has been removed: the “Our journey” menu now targets the introduction, while the timeline retains its own `journey` anchor.

Validation: `pnpm check` passed with no TypeScript errors. `pnpm build` completed successfully. The WebDev preview is running at `https://3000-iu1j68qhkd6a3lvvsb7uq-741bc8f6.sg2.manus.computer/`. The preview is not publicly published.

# SmartCart timeline fix notes

The original story animation could appear stuck because it used hard-coded trigger positions across a very long section, SplitText masks, and a sticky viewport inside `overflow: hidden`. The timeline has now been rebuilt around a measured `track.scrollWidth - viewport.clientWidth` distance with a GSAP `ScrollTrigger` pin and scroll-linked progress rail. The sticky stage has a solid dark background and sits inside a clipping wrapper that no longer acts as a scroll container.

Browser verification at the `#journey` section now shows the horizontal story track, produce cover, orange milestone rail, dates, titles, descriptions, and progress indicator together. The track continues horizontally into later milestones as the page scrolls. The setup includes a mobile-width layout and a reduced-motion swipeable fallback.

The corrected timeline is now visible in the live browser: the full stage has a solid dark backdrop; the produce cover, orange horizontal rail, milestone numbers/dates/headings/descriptions, and section title are present. The visible cards begin with March 2024 and continue through later milestones. TypeScript passes, and the production build completes (with only the template’s existing large-chunk advisory).

The completed browser view after the rewrite confirms the story section includes all seven milestones, the produce-image cover, and the orange progress rail. TypeScript and production builds both pass. The scroll-scrub is now measured from the actual rendered track and viewport widths, and the page uses a pinned dark stage; reduced-motion layouts remain directly horizontally scrollable instead of hiding the content.

## Glyph Portal integration (2026-09-24)

Source: user-provided 21st.dev attachment `/home/ubuntu/upload/pasted_content_2.txt`, which includes the GlyphPortal source component and demo contract. Added its reusable component at `client/src/components/ui/glyph-portal.tsx`, with a small optional `id` support and generated `data-gp-root` attribute used to scope the portal's inline styles independently from the anchor. Added a separate branded `SCAN` portal section in `client/src/components/SmartCartPortal.tsx`, placed between the household-reminder content and the existing SmartCart Journey. Added its own header link `The scan` → `#scan-portal`. The existing horizontal Development Storyline section remains after it.

Desktop full-page screenshot confirms the new portal section is distinct and the horizontal story section remains intact. Live-browser screenshot at `#scan-portal` displays the opening glyph cutout filled with the produce image, brand label, invitation copy, and Step into SmartCart control. Initial test exposed a style-scope issue caused by using a public ID as the generated style ID; the styles now target a private generated `data-gp-root` token while the public anchor remains `scan-portal`. TypeScript and production build passed before this final scope correction; run them again before checkpoint.


## Final portal runtime check

The rendered desktop snapshot confirmed that the section measured at 742px after private style scoping, so the 21st.dev camera can calculate the glyph. To prevent a long/slow inspection session from pinning the section permanently to its static fallback, removed the component's arbitrary 2.5-second “first frame” stall cutoff; the requested font is already switched to Arial fallback when unavailable. The component still respects `prefers-reduced-motion`, with an explicit `Play the scroll reveal` opt-in shown only when that preference is active. Opt-in is exposed through `motionOverride`, and the static CSS fallback no longer overrides the opt-in state.

Current final changes compile via both `pnpm check` and `pnpm build` (2026-09-24); Vite reports only its existing large-JavaScript-chunk advisory. Source: user-provided 21st.dev attachment, project files noted above, desktop/mobile full-page preview captures, and live-browser snapshots saved by the preview browser in `/home/ubuntu/upload/`.


## Development Storyline scroll diagnosis (2026-09-24)

User reports the Development Storyline does not scroll fully. Current source `client/src/components/ui/timeline.tsx` computes horizontal travel as `track.scrollWidth - viewport.clientWidth`, pins `.sc-timeline-stage`, and sets ScrollTrigger end to the greater of that distance or 1.2 viewport heights. CSS `.sc-timeline-track-clip` clips overflow on desktop and switches to `overflow-x:auto` under mobile or reduced motion. The live preview’s accessible page snapshot at `#journey` includes all seven milestones through “Remember the regulars,” so the content exists; next verify the actual final viewport/progress to distinguish insufficient trigger travel from sticky/pinning or mobile overflow behavior.

Two live-browser scroll attempts confirmed the symptom: at `#journey`, the pinned Storyline viewport showed only the first several milestones (through roughly October 2025), and another normal downward page-scroll made little/no movement. Browser output still extracts all seven milestone texts, so they are rendered but the navigation/travel to the final cards is inaccessible or truncated. Relevant live snapshot: `/home/ubuntu/upload/3000-iu1j68qhkd6a3lvvsb7uq-741bc8f6.sg2.manus.computer__journey_1790272448162.html`. The component's current scroll runway equals the measured track overflow, with the track's last card flush to the clip edge; check reduced-motion and pin-space behavior before choosing the fix.

Applied a likely pin-runway correction in `client/src/components/ui/timeline.tsx` and `client/src/index.css`: the ScrollTrigger sequence now uses the requested horizontal travel for the first 85% of the pinned scroll and a 15% end pause, with the pin duration derived from the measured track width. `.sc-timeline` now allows the pin spacer to expand its natural height instead of forcing a one-screen parent. A responsive end gutter should reveal the last card fully. For visitors requesting reduced motion, milestones now become a vertically stacked sequence instead of a horizontally overflowing strip. Next validate desktop scroll-to-end and the mobile reduced-motion fallback.

Post-fix browser navigation to `#journey` displayed the intro tail and Storyline opening. One normal page scroll returned “no position change detected” in the preview browser, suggesting the preview canvas is nested and the page-level scroll target did not reach the embedded page. Use the browser's explicit container target or test via a standalone local page before judging the updated travel distance.

Headless Chromium diagnosis: desktop pin distance 2,181 px fit before document max-scroll, and the final card was fully inside the clip at the end. Mobile motion mode had a 2,594 px trigger runway but document max-scroll stopped 1,399 px short because the mobile media rule forced `.sc-timeline { height: 100svh; }`, overriding pin spacer expansion. Thus desktop looked complete while mobile could not reach the later Storyline panels. Removed that fixed-height override so the section can grow by the complete pin spacing on mobile too. Reduced-motion fallback produced all seven milestones as a vertical stack.

After removing the mobile fixed-height override, the fresh headless run confirms both desktop and standard-motion mobile can reach track transform x=-distance with progress=1; “Remember the regulars” is fully inside the clip at the end. Desktop: 2,181 px runway, card x 941–1,331 within clip x 95–1,426. Mobile: 2,594 px runway, card x 28–348 within clip x 18–372, and page max-scroll now exceeds the target end by 1,195 px. The reduced-motion subtest was not valid because CDP reused the same URL/document when changing the emulated preference; force a full reload before evaluating that separate mode.

Final reloaded CDP verification passed all modes. Desktop ScrollTrigger progress reached 1 and the final “Remember the regulars” card bounds were x=941–1,331, fully within clip x=95–1,426. Mobile motion-mode progress reached 1, with the final card x=28–348 inside clip x=18–372 and visible vertically; page max-scroll exceeded the pin endpoint. With `prefers-reduced-motion: reduce`, ScrollTrigger was omitted, all seven cards stacked vertically in the section, and the final card could be scrolled fully into the viewport. Production TypeScript/build passed before the final mobile-height adjustment; rerun after that CSS adjustment before checkpoint.

Correction: `pnpm check && pnpm build` was rerun successfully after the mobile `.sc-timeline` height override was removed; the 3D cart update remains intact.
