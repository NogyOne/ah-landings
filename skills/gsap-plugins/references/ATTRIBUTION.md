# Attribution

This skill adapts the GreenSock `gsap-plugins` source skill and its MIT license.

- Upstream source: https://raw.githubusercontent.com/greensock/gsap-skills/main/skills/gsap-plugins/SKILL.md
- Upstream repository: https://github.com/greensock/gsap-skills
- Upstream author: `greensock`
- License: MIT (see `LICENSE-MIT.txt` in this directory)

This implementation narrows the upstream content to Halisco's needs: registration plus a decision table across plugins, with Flip carved out into `flip.md` as the primary use case (shared-element/thumbnail-to-dialog transitions). Registration and non-core plugin APIs stay in `gsap-plugins`; core tweens remain in `gsap-core`, ScrollTrigger remains in `gsap-scrolltrigger`, and runtime optimization remains in `gsap-performance`.
