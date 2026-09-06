# Flip Reference

Detailed guidance for `gsap/Flip`. This document informs decisions; it does not implement any specific Halisco carousel or lightbox.

## Canonical Sequence

```js
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const state = Flip.getState(targets, { props: "opacity" });
// mutate DOM/state here (reorder, resize, toggle visibility, open a dialog)
Flip.from(state, {
  duration: 0.5,
  ease: "power2.inOut",
  absolute: true,
  scale: true,
});
```

- Capture state with `Flip.getState()` **before** any mutation. Capturing after the mutation loses the "First" position and the animation cannot run.
- Correlate elements across the two states with matching `data-flip-id` values when the same logical item moves between different DOM nodes (e.g. a grid thumbnail becoming a dialog hero image). Mismatched or duplicate IDs cause Flip to skip or misapply the transition.

## Config Choices (make explicit, do not default)

| Option | When to set it |
| --- | --- |
| `absolute: true` | The element changes parent/stacking context during the flip (e.g. moves into a `<dialog>` or a portal-like container) so intermediate layout does not reflow siblings. |
| `scale: true` | The element's box size changes (thumbnail to full image) and stretching would look wrong; scales instead of resizing width/height. |
| `simple: true` | Only position changes (no size/rotation change) and a cheaper, less precise flip is acceptable. |
| `fade: true` (via `Flip.from` vars or nested state) | Elements are being added/removed between states, so the added/removed elements should cross-fade instead of jumping. |

## Same-Document Thumbnail → Dialog/Lightbox Considerations

These apply when a gallery/carousel item expands into a same-document `<dialog>` or lightbox overlay using Flip, rather than routing to a new page:

- **Snapshot timing**: call `Flip.getState()` on the thumbnail immediately before calling `dialog.showModal()` (or before toggling the visibility class that reveals the lightbox), not after. The lightbox's initial layout must already exist in the DOM (even if hidden/zero-opacity) so `Flip.from()` has a valid end state to read.
- **Duplicate active flip IDs**: only one instance of a given `data-flip-id` may be the active, visible target during a transition. If the gallery renders both a grid thumbnail and a hidden dialog copy with the same ID, ensure exactly one is display:none/hidden at any time Flip reads state, or scope IDs so only the pair involved in the current transition matches.
- **Focus and dialog semantics**: after `showModal()`, move focus into the dialog (a close button or the image container) and confirm `aria-modal`/native `<dialog>` focus-trap behavior is intact. Flip must not run before focus management, and must not visually complete before focus lands, or keyboard/screen-reader users lose context.
- **Reversible close strategy**: closing should reuse the same `getState()` → mutate → `Flip.from()` sequence in reverse (dialog state → close/hide → animate back to the grid thumbnail position) rather than a separate, uncoordinated close animation. Store the original thumbnail's `Flip.getState()` (or its `data-flip-id`) so the close animation can target it even if the grid re-rendered.
- **Interrupted animation cleanup**: if the user closes the dialog (Escape, backdrop click, rapid re-click) while a Flip tween is still running, kill or let the in-flight tween be overwritten by the new `Flip.from()` call rather than starting a second uncoordinated animation; GSAP's overwrite behavior on the same targets handles most cases, but confirm no orphaned tween keeps a hidden dialog visually mid-transition.
- **Default-visible/fallback behavior**: if JavaScript fails to load or the plugin fails to register, the dialog/lightbox must still open and close correctly via native `<dialog>` behavior (or a CSS-only fallback) without Flip. Do not make the opening/closing mechanism itself dependent on the animation succeeding.

## Learn More

https://gsap.com/docs/v3/Plugins/Flip
