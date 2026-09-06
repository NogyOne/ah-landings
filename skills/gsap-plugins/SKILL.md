---
name: gsap-plugins
description: "Trigger: GSAP plugins, Flip, FLIP animation, registerPlugin, shared-element transition. Register GSAP plugins and apply Flip layout transitions safely."
license: MIT
metadata:
  author: "greensock"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Registering a GSAP plugin (Flip, Draggable, Observer, SplitText, etc.) in Halisco"
    - "Implementing or reviewing a Flip/FLIP layout or shared-element transition in Halisco"
---

## Activation Contract

Load this skill for GSAP plugin registration and plugin-specific APIs — especially Flip layout/shared-element transitions, Draggable, SplitText, and other non-core, non-ScrollTrigger plugins in Halisco.

## Hard Rules

- All GSAP plugins ship in the public `gsap` package; install only `gsap`. Never add an `.npmrc` auth token, a private `npm.greensock.com` registry, or a Club GSAP membership step — those are outdated.
- Import each plugin from its own path (e.g. `gsap/Flip`) and register it once with `gsap.registerPlugin(...)` before first use.
- For layout transitions use the canonical Flip sequence: `Flip.getState()` → mutate the DOM/state → `Flip.from()`. Never mutate before capturing state.
- Correlate different elements across states with matching `data-flip-id`; choose `absolute`, `scale`, `simple`, and `fade` deliberately per transition, never by default.
- Revert or kill plugin instances (Flip-adjacent state, SplitText instances, Draggable) on component teardown, and respect `prefers-reduced-motion` by shortening or skipping the flip duration.
- Never ship `GSDevTools` to production.

## Decision Gates

| Need | Pattern |
| --- | --- |
| Layout or shared-element transition (reorder, expand/collapse, thumbnail to dialog) | Flip; see `references/flip.md` |
| Scroll to a position or element without ScrollTrigger | `ScrollToPlugin` |
| Drag or throw interaction | `Draggable` (+ `InertiaPlugin` for momentum) |
| Swipe or gesture normalization | `Observer` |
| Per-character/word/line text animation | `SplitText` |
| SVG stroke draw/erase or shape morph | `DrawSVGPlugin` / `MorphSVGPlugin` |
| Core tween, ScrollTrigger, or runtime perf work | Use `gsap-core`, `gsap-scrolltrigger`, or `gsap-performance` instead |

## Execution Steps

1. Identify the plugin(s) needed and import each from `gsap/<PluginName>`.
2. Register every plugin once with `gsap.registerPlugin(...)` before any tween or API call that uses it.
3. For Flip specifically: capture `Flip.getState()` on the affected elements, apply the DOM/class/visibility mutation, then call `Flip.from()` with explicit `absolute`/`scale`/`simple`/`fade` choices — see `references/flip.md` for dialog/lightbox specifics.
4. Wire cleanup: revert SplitText instances and kill Draggable/Flip-adjacent work when the owning component unmounts or the element is removed.
5. Verify `prefers-reduced-motion` behavior, keyboard/focus continuity for dialogs, and confirm no GSDevTools code ships.

## Output Contract

Return the plugin(s) registered, the Flip/Draggable/etc. config chosen and why, cleanup strategy, reduced-motion behavior, and verification performed.

## References

- `references/flip.md` — Flip-specific guidance, including same-document thumbnail-to-dialog/lightbox considerations.
- `references/ATTRIBUTION.md` — upstream source and license record.
- `references/LICENSE-MIT.txt` — retained upstream MIT license text.
- `../../apps/halisco-landing/AGENTS.md` — Halisco static-rendering and client-runtime constraints.
