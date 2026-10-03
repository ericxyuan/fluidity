# Selection and integration

Read component candidates by **interaction**, not gallery appearance. These tiers
describe runtime usefulness, not a license to introduce every listed component.

| Need | Tier | Unified starting point |
| --- | --- | --- |
| Simple press, focus, form controls | CORE | Existing native/project controls; the design guidance feedback and frequency gate |
| Selected background/underline | CORE | Motion SelectionIndicator decorating the real selection primitive |
| Single disclosure whose body can unmount | CORE | Motion Disclosure; simple API and presence |
| Compound disclosure preserving mounted drafts | CORE | the composition source measured Disclosure; observer and explicit compound slots |
| Dialog/popover/menu/combobox | CORE | Host Radix/Base UI semantics, source motion recipes where useful |
| Exclusive local tabs/panels | CORE | Host tabs first; the composition source DirectionAwareTabs when local immediate panels fit |
| Inline edit and data selection | CORE | the application source-derived InlineEdit and stable-ID selection helpers |
| Pagination | CORE | the application source-derived normalized model with native controls |
| Responsive sidebar | CORE | the application source desktop/mobile state split; one matching CSS/JS breakpoint |
| Occasional text, number or content transitions | SPECIALIZED | Motion adapters; preserve semantic final values |
| Glass surface or selected stack | SPECIALIZED | Local Fluidity extension contracts and adapters |
| Comparison, drag reorder, dock, chart crosshair | SPECIALIZED | Local detailed recipes; keep precise controls stable |
| Infinite marquee, cylinder carousel, particle effects | REFERENCE/REJECT | Only use a specific justified mechanism; not a default UI treatment |

## Seven layers of adaptation

For a candidate identify interaction (what input does), information structure (what
belongs together), layout (flow/stack/grid), responsive strategy, motion, implementation
and styling. For example the application source's card swipe contributes bounded selection and
distance/velocity handling, but not its sample hobby content, fixed 320px dimensions,
3D cylinder or icon packages. The composition source contributes handle-based gesture composition and
measured content; Motion contributes stable motion values and presence architecture.

Compare usefulness, interaction, adaptability, accessibility, responsive behavior,
implementation quality, dependencies, performance, uniqueness, composition and
maintenance. Reject duplicate variants that differ only in visual decoration. A
persistent disclosure and an unmounting disclosure have different state-lifetime
contracts, so both local forms remain with clear selection criteria.

## Copy/adapt contract

1. Inspect the host's component, theme and dependency conventions. React/Motion are
   **consumer** dependencies for TSX adapters, not GitHub runtime dependencies.
2. Copy the selected asset and its relative helpers.
3. Map data-slot/data-state/classes/CSS variables to project tokens. Avoid literal
   upstream colors, sample logos, icons, media, fixed widths and external image URLs.
4. Use stable entity IDs, explicit controlled values/callbacks and separate ephemeral
   state. `defaultValue` initializes once; it must not pretend to be a controlled value.
5. Keep overlays in an accessible primitive. Shared layout and portals do not supply
   trapping, names, Escape, dismissal order or return focus. Avoid nested interactive
   elements such as a full-card button containing links.
6. Use the project's existing tests and the task's observable acceptance criteria.
   No adapter is automatically verified across every browser, device or design system.

Base CSS is opt-in; it has no global typography/reset and uses `--fluidity-*` fallbacks.
Source examples retain implementation details in the references so a recipe can be
rebuilt offline. They are not commands to install a registry CLI or fetch upstream code.

For non-React or native platforms, transfer the state/gesture model, not TSX/CSS.
The design guidance's Expo guidance contributes the distinction between UI-thread gesture values and
React state, native navigation behavior, no hover dependency and device validation;
this release supplies web adapters, not an Expo or Swift component library.
