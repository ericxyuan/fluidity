# Motion architecture and reusable implementation reference

This local reference distills implementation knowledge from **the motion patterns** at commit `40f59b61e567712aa8329c7dc8c2ced763054c34`. The development source map identifies every inspected source and inclusion decision. Runtime work uses this file and the adjacent assets; it does not require fetching the source repository.

 The six local adapters identify their changes in their headers. Source examples use externally hosted images and brand assets; those media are not included or assumed licensed for project use. The source scroll-lock hook declares Adobe React Spectrum ancestry and is deliberately not vendored.

## Choose the behavioral model before the effect

These motion patterns provide small, composable motion mechanisms: `AnimatePresence` retains departing content; shared `layoutId` connects representations of one thing; variants coordinate children; `MotionValue` carries high-frequency values without React rendering each frame; a spring smooths a target; measurement determines travel distance and duration. These mechanisms can serve an existing project without its adopting the source gallery's colors, typography, imagery, shadows, radii, or spacing.

The source's animated tabs are visual examples, not a complete tabs implementation. Morphing dialogs demonstrate continuity, not a complete accessible overlay foundation. Keep native or established accessible semantics in charge of state, focus, activation, and dismissal. Add a motion layer around that behavior. Apply the shared Fluidity motion rules for timing, interruption, purpose, and reduced motion; source demo values are evidence, not universal defaults.

## Local adapters and contracts

All adapters are React client components importing `motion/react`. Copy only the needed files. They have no Next.js, shadcn CLI, registry server, icon, Tailwind, or `@/` alias dependency. Consumers supply visual classes or tokens; consumers also supply ordinary React and Motion packages in their project. A plugin asset is a recipe source file, not an automatically installed application dependency.

| Local asset under `../assets/motion/` | API and behavior | Caller responsibility |
| --- | --- | --- |
| `selection-indicator.tsx` | `SelectionIndicator({active, groupId, className?, style?, transition?})`; one shared background identity across selected controls | Create one `useId()` per group, keep selected value controlled by the real control, provide native buttons/radios or accessible tabs; put the label above the background |
| `disclosure.tsx` | `Disclosure({summary, children, open?, defaultOpen?, onOpenChange?, className?, triggerClassName?, contentClassName?, transition?})`; native button, `aria-controls`, named region, height/opacity presence, focus restoration when externally closed | Supply concise summary and content; keep interactive children out of summary; use `open` plus callback for controlled mode; in accordion composition, own the single or multiple selection model |
| `transition-panel.tsx` | `TransitionPanel({activeKey, children, direction?: -1\|0\|1, className?, transition?})`; keyed presence with `popLayout`, departing content becomes inert | Own tabs/wizard state and focus. Pass stable entity keys; reserve or manage container height if needed; changing the key remounts content, so lift drafts and form state above it |
| `text-reveal.tsx` | `TextReveal({children: string, unit?: 'word'\|'line', stagger?, maxStaggerDuration?, className?})`; semantic text once, decorative segments, bounded stagger | Use only for short display copy where the reveal has a purpose. Place in an appropriate heading or paragraph. `line` means explicit newline, not measured visual wrapping |
| `animated-number.tsx` | `AnimatedNumber({value, locale?, formatOptions?, springOptions?, className?})`; spring visual value plus immediately exact semantic value | Use static numbers for financial confirmation, passwords, codes, critical thresholds, or rapid live feeds; choose precision and reserve width. Announce meaningful changes separately, never each frame |
| `pointer-tilt.tsx` | `PointerTilt({children, className?, surfaceClassName?, maxAngle?})`; optional fine-mouse enhancement, stable outer coordinate surface, normalized pointer → spring → transform | Decorative surface only. Do not make it the only sign of interactivity, move precision controls, or place a 3D effect over essential dense reading. Keep hit targets stable |

Local motion defaults are conservative integration choices, not verbatim source defaults. The canonical `fluidity-motion/references/motion-policy.md` takes precedence. Each adapter disables spatial animation until `useReducedMotion()` explicitly reports `false`. This is intentionally safer during first render/SSR uncertainty. SelectionIndicator, Disclosure, TransitionPanel, TextReveal, and AnimatedNumber also accept `instant?: boolean`: propagate keyboard/assistive activation and frequent command behavior through this flag. Disclosure detects its native trigger's `event.detail === 0`; its external changes still need the caller's modality flag. TransitionPanel passes latest instant/direction settings through presence custom data so an outgoing child uses the new action's modality. Inspect actual browser behavior after adopting an adapter; source-derived does not mean browser-verified in every target application.

### Selection example: no hidden control semantics

```tsx
import { useId, useState } from 'react';
import { SelectionIndicator } from './selection-indicator';

function PeriodControl() {
  const groupId = useId();
  const [period, setPeriod] = useState('week');
  const [instant, setInstant] = useState(false);
  return (
    <div role="group" aria-label="Reporting period" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {['day', 'week', 'month'].map(value => (
        <button key={value} type="button" aria-pressed={period === value}
          onClick={event => { setInstant(event.detail === 0); setPeriod(value); }}
          style={{ position: 'relative', isolation: 'isolate' }}>
          <SelectionIndicator active={period === value} groupId={groupId} instant={instant}
            style={{ background: 'var(--selection-surface)' }} />
          <span style={{ position: 'relative' }}>{value}</span>
        </button>
      ))}
    </div>
  );
}
```

This is a named button group, not tabs or a radiogroup. For real tabs, use the project's tab implementation for roles, `aria-selected`, roving focus, arrow keys, panels, and activation. Render the same indicator inside each tab trigger. Changing hover must not activate a tab. Optional hover preview is a separate ephemeral state that also responds to focus and never replaces selection semantics.

## 1. Presence and identity

**Source:** `components/core/transition-panel.tsx`, `text-loop.tsx`, `disclosure.tsx`, `accordion.tsx`, and the transition-panel docs/examples.

The source transition panel renders `children[activeIndex]` in a keyed `motion.div` beneath `AnimatePresence initial={false} mode="popLayout"`. Changing `activeIndex` creates a new presence identity. Its variants are named `enter`, `center`, and `exit`; `custom` is passed to both presence and the motion child so exit can use updated direction. An ordinary conditional without a surrounding presence boundary removes the node before an exit animation can run.

Preserve these distinctions:

- **React `key`** determines component identity and state lifetime. An entity key avoids accidentally animating or resetting the wrong record after reordering. Index keys are acceptable only for truly static order.
- **`layout`** animates a node's own measured layout change.
- **`layoutId`** links two representations of the same visual object, potentially in different DOM subtrees.
- **`AnimatePresence`** delays physical removal so exit can finish. It does not suspend business logic, disable exiting controls, or manage focus for you.
- **`initial={false}`** skips introductory motion for children present on the boundary's first render; it does not disable subsequent entrances or exits.
- **`mode="popLayout"`** removes exiting layout occupancy while preserving its visual exit. Its immediate custom child must forward its ref to the relevant DOM element. Give the positioning parent a stable positioned box.
- **`mode="wait"`** sequences exit then entry and is useful only when that explicit sequencing helps comprehension. It delays the incoming visual; do not use it automatically for frequent controls.
- **`mode="sync"`** lets entering and exiting elements coexist. Account for layout and input hit testing during overlap.

The local panel uses stable keys, a forwarded frame ref, and `useIsPresent()` to make the outgoing frame inert and hidden from assistive technology. The caller should keep focus on the selecting tab/step button or explicitly move it to the new view. A panel transition should not leave focus in a disappearing form. Do not use `overflow: hidden` everywhere: it may clip focus outlines, menus, or content shadows; add clipping only to the intended visual viewport.

The source `TextLoop` is a timer selecting `(current + 1) % items.length`, default interval **2 seconds**, default transition **0.3 seconds**, default `popLayout`. A timer-driven loop is not required by the presence technique. Prefer event-driven panel changes. If a loop is explicitly justified, handle an empty list, preserve an in-range index when the list changes, pause on focus/hover and document visibility, expose a user pause control where needed, stop under reduced motion, and clean up the interval. The source cleans up its interval but does not supply those other policies.

## 2. Shared selection backgrounds

**Source:** `animated-background.tsx`, `app/docs/animated-background/page.mdx`, `segmented-control.tsx`.

The source accepts children carrying unique string `data-id`, `defaultValue`, `onValueChange`, `className`, `transition`, and `enableHover=false`. It allocates `useId()`, then renders an absolute background with `layoutId="background-${uniqueId}"` in the active child. Matching identity makes the same background appear to travel between independently laid out controls. Child labels sit above it at `z-10`. The `className` prop styles the background, not a group wrapper.

Its `defaultValue` is reapplied in an effect whenever that prop changes; it is not a clean controlled `value` contract. Its `cloneElement` adds `onClick` or mouse enter/leave handlers, replacing child event handlers, and it adds `data-checked` rather than native selection semantics. Hover examples lose the active background when traversing a gap; the docs explicitly warn about child spacing in hover mode.

The Fluidity adapter retains the single moving background and ID scoping while removing event ownership. This is the preferred unified selection-animation technique for segmented controls, navigation, or list selection supplied by other repositories. Keep one selected state, optional independent hovered/focused state, and an explicit precedence rule. Maintain keyboard-visible focus even if the selected indicator moves elsewhere.

## 3. Disclosure and accordion

**Source:** `disclosure.tsx`, `accordion.tsx`, `app/docs/disclosure/disclosure-card.tsx`.

Both source components use the same useful state targets: `expanded = {height: 'auto', opacity: 1}`, `collapsed = {height: 0, opacity: 0}`. The presence boundary is below the state owner. A `MotionConfig` provides one transition to the subtree; custom expanded/collapsed variants shallow-merge into the base variants. Overflow clipping wraps the height animation. A card example uses the same open state to coordinate an image and details, demonstrating one state producing several intentional visual consequences.

Source API details to preserve when reproducing a more elaborate compound form:

- `Accordion` accepts `expandedValue?: React.Key|null`, `onValueChange`, `variants`, `transition`; a context distributes active identity and toggle. `AccordionItem value` injects identity into its trigger/content children. Re-selecting the expanded identity collapses it.
- `Disclosure` accepts `open`, `onOpenChange`, `variants`, `transition`; provider state is initialized and synchronized from `open`. It renders only the first two children, which makes ordering part of its implicit API.
- `AccordionTrigger` is a real `button type="button"`; `DisclosureTrigger` clones arbitrary children and simulates button keyboard behavior.

Do not preserve the source's semantic gaps: trigger/content IDs are not linked in the accordion, disclosure content's generated ID is not connected by `aria-controls`, and cloned handlers can override or be overridden by supplied child props. Callback presence must not determine whether a component is controlled: presence of the controlled value should. Use native buttons; one `onClick` already handles Enter and Space without adding double activation. On closing, remove descendants from tab order immediately while visual exit finishes. A multi-open accordion should own a set of stable values, not introduce conflicting internal booleans per item.

The local `Disclosure` is intentionally smaller than a new accordion framework. For a full accordion use an existing accessible project primitive and add these animation targets; for a single expandable card or details section the local implementation is sufficient to adapt. Avoid an entire card as a button when it contains links or other controls.

## 4. Shared-element expansion without rebuilding modal semantics

**Source:** `morphing-dialog.tsx`, `morphing-popover.tsx`, `dialog.tsx`, `app/docs/morphing-dialog/morphing-dialog-basic-1.tsx`, `app/docs/morphing-popover/morphing-popover-textarea.tsx`.

The important architecture is multi-part continuity. The source morphing dialog shares distinct IDs for shell (`dialog-${uniqueId}`), title container, subtitle container, image, and optionally description. Trigger and expanded content render matching IDs; the overlay is portalled after mounting; the backdrop fades independently. Radius is supplied in `style` in the representative example, allowing the compact 12px shell and expanded 24px shell to participate in interpolation. A `MotionConfig` shares the chosen transition. Details that have no meaningful compact counterpart enter with their own variants and may opt out of layout matching.

The popover uses a similar shell ID (`popover-trigger-${uniqueId}`) and label ID. Its controlled/uncontrolled helper correctly chooses `controlledOpen ?? uncontrolledOpen`, updates internal state only when uncontrolled, and always notifies `onOpenChange`. Retain that contract for Fluidity controls.

Use the following recipe with the **existing project's accessible overlay**, whose API and mounting behavior must already be understood:

1. Allocate one `useId()` or stable scoped namespace for the expanded object. Create IDs for `shell`, `media`, and, only where useful, `title`.
2. Let a native trigger or accessible dialog trigger own activation. Keep one interactive trigger; do not nest buttons. Render a motion shell and matching media/title inside it, with project tokens and numeric radius style.
3. The overlay primitive owns `open`, Escape, outside interaction policy, focus containment, focus restoration, portal ordering, scroll lock, and actual modal/inert behavior. Use its title/description APIs so labels resolve to real IDs.
4. Keep the content mounted through exit using the primitive's documented force-mount or presence integration. Put shared IDs on the visual content shell inside that overlay. Do not replace the overlay with a generic `div` just to obtain an animation.
5. Animate the backdrop's opacity separately. Keep its lifetime and pointer blocking consistent with modality. Backdrop animation does not make the rest of the page inert.
6. Shared IDs belong only to views of the same entity. Namespace repeated cards. Use layout animation sparingly on text to avoid letter scaling and reflow distortion; position-only continuity or an independent fade is often clearer.
7. Under reduced motion remove shared layout movement and use immediate state changes or the unified short nonspatial fade. Preserve focus, dismissal, and state.
8. Constrain expanded content to the viewport, allow its content area to scroll, and test after rotation/resize and with the software keyboard. Source fixed demo sizes are not a responsive strategy.

Implementation-level sketch for the **visual parts**, not a modal component:

```tsx
const namespace = useId();
const shellId = reduceMotion ? undefined : `${namespace}:shell`;
const mediaId = reduceMotion ? undefined : `${namespace}:media`;
// In the accessible trigger:
<motion.span layoutId={shellId} style={{ display: 'block', borderRadius: compactRadius }}>
  <motion.img layoutId={mediaId} src={src} alt={alt} />
  <span>{title}</span>
</motion.span>
// Inside its corresponding accessible overlay content:
<motion.div layoutId={shellId} style={{ borderRadius: expandedRadius, maxHeight: 'calc(100dvh - 2rem)', overflow: 'auto' }}>
  <motion.img layoutId={mediaId} src={src} alt={alt} />
  {/* Real overlay title, description, close control, and details go here. */}
</motion.div>
```

Source defects explain why the entire source overlay is not vendored: the morphing dialog's internal trigger ref is not wired by its default trigger, its `aria-labelledby`/`aria-describedby` strings do not match the provided title/description IDs, its content ID does not match the trigger's `aria-controls`, and its focus scan is a one-time hand-written selector that does not robustly account for hidden/disabled/dynamic focusables or nested overlays. The representative card demo nests a button inside the trigger button. The popover advertises `aria-modal=true` without equivalent modal focus/background behavior. The plain dialog's native `showModal()` approach is a useful semantic direction, but its default variants do not define the requested `exit` variant and its portal/effect ordering and scroll locking require integration verification. Preserve the visual technique; use stronger semantics available in the project.

## 5. Text architecture and timing

**Source:** `text-effect.tsx`, `animated-group.tsx`, `text-morph.tsx`, `text-roll.tsx`, and text-effect docs/examples.

The source `TextEffect` splits text by `/(\s+)/` for words or characters, preserving whitespace as segments; explicit-line mode splits `\n`. Character mode then splits each segment with `split('')`. Parent variants coordinate child variants; segment wrappers optionally clip the motion. It exposes `per`, polymorphic `as`, `preset`, `variants.container`, `variants.item`, `delay`, `speedReveal`, `speedSegment`, `trigger`, callbacks, `segmentWrapperClassName`, and both container and segment transitions.

Its source timing formulas are worth retaining: default stagger is **0.03s per character**, **0.05s per word**, or **0.1s per explicit line**, divided by `speedReveal`; base segment duration is **0.3s / speedSegment**. Custom visible variant stagger/delay can override defaults, and top-level transition props are merged. Nonpositive speed values would produce invalid or infinite timing, so validate them if retaining that API. Review total reveal time, not only a single segment: `(segmentCount - 1) * stagger + duration`. Do not allow a long heading to hold back all usable information.

The source presets are `blur`, `fade-in-blur`, `scale`, `fade`, `slide`; the docs list `blur-sm` in one table, but the implementation's actual union is `blur`. Some source presets are intentionally expressive: 12px blur, scale 0, or 20px movement. Fluidity uses a short, subtle reveal only where warranted and does not adopt every gallery preset as a default. The local `TextReveal` retains parent/child composition, exact semantic text, whitespace and explicit-line handling, but caps the stagger window and omits expensive blur and large movement.

For character effects that are explicitly requested, segment graphemes with `Intl.Segmenter(locale, {granularity: 'grapheme'})` where supported, rather than splitting UTF-16 code units. Preserve one unsplit accessible string and hide decorative graphemes. Keep words grouped so ordinary line wrapping still works; do not prohibit wrapping across an entire sentence. If language support cannot be tested, use word or whole-string animation instead.

`TextMorph` creates identity as namespace + lowercased character + occurrence count. Characters repeated in successive words can share layout identity, so reused letters move and added/removed letters fade. Source spring is `{stiffness:280, damping:18, mass:0.3}` and `AnimatePresence initial={false} mode="popLayout"`. This is a specialized technique for a short label, not a general diff algorithm. Case-folded identity and `split('')` require care with Unicode; a stable semantic string must remain accessible. The source uses `aria-label` on an arbitrary tag, which does not reliably replace semantic text for every generic element, so prefer an actual unsplit screen-reader-only text node plus `aria-hidden` decorative spans.

`TextRoll` uses two overlaid glyphs per character, perspective, different transform origins, and rotateX targets 0↔90; an invisible glyph reserves each character's width. The final glyph gets the completion callback. Preserve this as a specialized recipe only if the flip itself conveys an intentional state. Never make a status wait for it.

`AnimatedGroup` exposes container/item variants and polymorphic wrapper tags; it creates motion components with `useMemo`. It wraps each child and uses index keys. The useful general rule is one parent controlling an intentional group, not a preset menu of flips/bounces/rotations. Preserve semantic lists with `ul/li`, and use entity keys when list membership changes. Avoid wrapper elements that break grid sizing or native semantics.

## 6. Values, springs, and direct manipulation

**Source:** `animated-number.tsx`, `sliding-number.tsx`, `tilt.tsx`, `magnetic.tsx`, `dock.tsx`, `image-comparison.tsx`.

The reusable value pipeline is **input → MotionValue → transform → DOM style**. Add a spring only where a target should be followed rather than directly manipulated. The source tilt sets raw x/y motion values, springs them, then maps normalized coordinates `[-0.5,0.5]` to rotations; `useMotionTemplate` builds `perspective(1000px) rotateX(...) rotateY(...)`. No React render is needed for every pointer event. The source default `rotationFactor=15` describes the map's endpoint rotations, and the API misspells `isRevese`; the local adapter chooses a clearer bounded surface API and a smaller optional angle.

Measure pointer coordinates against an untransformed wrapper. Repeatedly measuring the tilted element can feed its changing bounds into the next transform. Use `clientX/clientY` with `getBoundingClientRect`, never mixed page and viewport coordinates. Scope listeners to the active surface, disable the effect on coarse/touch input and reduced motion, reset on pointer leave/cancel, and leave the original content fully usable without the effect. A springy visual card is not authorization to make a precise hit target chase the pointer.

Source `Magnetic` computes vector-to-center, Euclidean distance, then an attraction falloff `1 - distance/range`; output is vector × intensity × falloff. It installs a document mousemove listener and supports self/parent/global activation. Retain the falloff math as reference only; globally moving controls and unbounded listeners are a poor default. A decorative sublayer can move while its hit target stays fixed. This distinction is especially important for Apple Glass Card: glass is a surface option, not a reason to add magnetic movement to every button.

`AnimatedNumber` springs a numeric target and formats rounded values with `toLocaleString()`. Its polymorphic `motion.create` call happens inside rendering; the local asset uses a stable motion tag and explicit formatting. Do not use a spring to imply intermediate measured truth. The semantic value changes to the real number immediately; the visual interpolation is an optional presentation. A reduced-motion preference jumps to the final value.

`SlidingNumber` extracts place digits with `floor(value/place) % 10`, renders ten overlaid rows per digit, measures glyph height, and maps the spring value to a cyclic offset:

```ts
const placeValue = current % 10;
const offset = (10 + renderedDigit - placeValue) % 10;
const y = (offset > 5 ? offset - 10 : offset) * measuredGlyphHeight;
```

This chooses a short rolling path around the ten-row ring. It supports a negative sign, optional leading zero, and a decimal separator. Its digit heights are measured separately via `react-use-measure`, so many digits multiply observer/DOM work. If adapting, share a font-height measurement, keep width in `ch`, format locale/grouping intentionally, avoid scientific-notation parsing, expose exactly one semantic number, and use a static fallback before measurement and under reduced motion. A simple spring number is the lower-cost default; rolling digits are specialized.

## 7. Gesture recipes: carousel and comparison

**Source:** `carousel.tsx`, `app/docs/carousel/carousel-custom-sizes.tsx`, `image-comparison.tsx`, its spring example.

### Carousel

The source splits state, content, item, navigation, and indicators into context-composed components. `Carousel` accepts `initialIndex`, controlled `index`, callback, and `disableDrag`; `CarouselContent` binds a horizontal `dragX` motion value, locks drag constraints at zero, disables momentum, and changes index on ±10px displacement. Its visual target is `translateX = -index * (100 / visibleItemsCount)%`. Items are nonshrinking flex children; examples use fractional `basis` to show multiple items. Navigation disables at bounds; indicators are named buttons.

Retain composition and explicit index state. Do not transplant the source's positioning calculation unchanged. Its IntersectionObserver callback counts only intersecting entries delivered in that callback, although callbacks contain changed entries rather than a complete visibility inventory. This can make `visibleItemsCount` wrong or zero. It observes a translated track as its own root, and bounds based on all items allow partial last pages. Fluidity should either use the project's proven carousel or deliberately choose one of these models:

- **Uniform slides:** measure the viewport/slide width and gap; target is `-(index * (slideWidth + gap))`, clamped to the last valid offset. Recompute on `ResizeObserver` updates. The selected index is clamped when data shrinks.
- **Variable widths or native scrolling:** measure each slide's actual offset, or use scroll snapping with explicit navigation buttons. Do not derive arbitrary widths from a changing visible-entry count.
- **Stacked Card Set:** map one selected ID to layers and visible cards; use the same state for buttons and optional gestures, and follow the extension's explicit conservative behavior. A stacked visual is not automatically a paginated horizontal carousel.

During drag, track the pointer directly. Decide the release with a documented displacement/velocity model appropriate to the project, then spring the selected target. Do not copy ±10px as a universal threshold. Keep vertical page scrolling working (`touch-action: pan-y` for a horizontal drag surface), handle pointer cancel, bound travel, and prevent accidental item activation after a drag. Show usable previous/next controls on touch and keyboard; source hover-hidden buttons are inadequate as the only navigation. Keep a named region and current-position text, and remove offscreen interactive slides from tab order. Do not add auto-play by default.

### Image comparison

The source starts at 50%, maps pointer position to a clamped 0–100 range, and drives two `clip-path: inset(...)` values plus slider `left` from one motion value. A context makes images and slider share position. It supports hover mode or drag and optional spring configuration. Its default spring is effectively instantaneous `{bounce:0,duration:0}`, a useful source example of direct response. The `position='left'` image is clipped from the left (revealing its right side), so preserve actual geometric meaning rather than guessing from that prop name.

The source interaction is a mouse/touch-driven `div`, with no keyboard slider and no pointer capture. A generalized Fluidity version should use a **native `input type="range" min=0 max=100`** with a visible label, value text, and sufficient target size as the authoritative control. Its `onChange` drives one value and both clipping functions. An optional drag handle can use pointer capture while sharing exactly that value. During direct dragging, do not spring behind the pointer; spring only a programmatic position change if useful. Provide meaningful alternative text and before/after labels, let users view either image fully, and preserve aspect ratio/fit across sizes.

```ts
const percent = Math.min(100, Math.max(0, value));
const revealLeft = `inset(0 ${100 - percent}% 0 0)`;
const revealRight = `inset(0 0 0 ${percent}%)`;
// range.value, handle.left, revealLeft, and revealRight share percent.
```

## 8. Specialized spatial and measured patterns

**Dock:** source default base item width is 40px, magnification 80px, influence distance 150px, panel height 64px. A shared mouse X value is transformed separately by each item: signed distance to its center maps `[-distance,0,distance]` to `[40,magnification,40]`, then a spring smooths width. Icon width is half its item's width. Hover/focus drives a separate tooltip presence state. The outer row reserves expanded height and allows horizontal scrolling. Preserve shared value + per-item mapping and available overflow space. Correct the source's `pageX` vs `rect.x` mismatch, `div role=button` without Enter/Space activation, generic `aria-haspopup`, and tooltip association. Prefer real buttons/links, appropriate toolbar keyboard behavior, visible labels or proper accessible names, a static touch layout, and no mandatory magnification. Width animation moves layout; profile this with many items. Dock is specialized, not the navigation default.

**Infinite slider:** source duplicates the children, measures the combined track, and loops from 0 to `-(measuredSize + gap)/2` (reversed when requested). Duration is travel distance / speed, where speed is **pixels per second**, not duration. On speed changes it travels from the current position to the boundary using remaining distance/current speed, then restarts a full loop; effect cleanup stops the animation. This preserves phase without a reset jump. If reusing the recipe, prefer measuring one full group including the seam gap, require finite positive speed, handle zero speed as paused instead of dividing, and make the duplicate group `aria-hidden` and inert. The source's truthiness checks make `speedOnHover=0` fail as a pause setting, and duplicate children remain interactive/announced. A static scrollable list with visible content is usually stronger; include a loop only for an explicit justified presentation and supply pause/reduced-motion/visibility controls. Keep data tables and actionable cards out of a perpetual marquee.

**In-view:** source wraps `useInView(ref, viewOptions)` and chooses hidden/visible variants. It records an `isViewed` flag in any animation-complete callback when its separate `once` prop is set. Preserve observation and variants; use the observer's actual `once` option where appropriate rather than treating any completed hidden animation as proof the object was viewed. Leave essential content visible without animation and ensure keyboard navigation never enters invisible interactive children. Prefer a small number of observer boundaries to one per letter/card if the page is large.

**Scroll progress:** source `useScroll({container})` provides a 0–1 `scrollYProgress`; spring defaults are stiffness 200, damping 50, restDelta .001. A bar with origin-left uses `scaleX` instead of width. Use raw progress under reduced motion; choose the actual scrolling container and account for dynamically loaded content. The bar is a reading-position supplement, not a substitute for headings. A decorative bar should be hidden from assistive technology; if meaningful semantic progress is needed, use a properly named progress element with an appropriate update policy.

**Expandable toolbar:** source takes current content height from `react-use-measure`, clips an animated height shell, and places the selection buttons below. It captures the toolbar width once as `maxWidth`. Generalize `ITEMS` into supplied `{id,label,trigger,content}` data, supply controlled active/open state, and use one selected content subtree rather than hidden copies of every panel. Reobserve available width after resize and content/font changes; a once-captured width is not responsive. Add Escape, proper focus return, a named labeled search field, and state semantics. The dynamic toolbar's 98→300px animation and gallery items are demonstration details, not component APIs. Both are local implementation recipes rather than copied hard-coded application widgets.

## 9. Visual techniques retained only as reference

`ProgressiveBlur` creates masked, overlapping backdrop-filter layers. Direction maps top/right/bottom/left to 0/90/180/270 degrees; each layer has four alpha stops and a blur amount `index * blurIntensity`. Source defaults are eight layers and intensity .25. It clamps rendered layer count to at least two but computes segment size from the original input; normalize once before both computations if adapting. Each backdrop layer incurs compositing cost. For Apple Glass Card use a single restrained blur surface with opaque fallback first; stacked blur layers are not a default card material. Measure readability over actual backgrounds and preserve pointer-events:none on decorative overlays.

`Spotlight` follows the pointer with a radial-gradient blurred div. Its `AbortController` cleanup is useful listener management. It mutates its parent's position/overflow styles without restoration; do not import that side effect. The parent should declare its layout intentionally. The source uses `left/top`; where feasible render with a transform and bound the effect to a small decorative surface. Disable or omit on touch and reduced motion.

`BorderTrail` uses a masked border box plus `offsetPath: rect(...)` and animates `offsetDistance` 0→100 forever. Keep the path/mask idea only as a specialized explicit effect; it should not be the sole loading/validation signal. `GlowEffect` animates gradient strings and blur with several infinite modes. A dynamic `blur-[${value}px]` class is not statically discoverable by Tailwind without safelisting; style values or fixed classes are safer. Neither effect belongs in the default component set.

`Cursor` replaces body/parent cursors and follows document mouse events. The source does not restore body cursor styles and attempts to remove anonymous listeners using new anonymous functions, which does not remove the registered listeners. Reject it as a reusable default. Do not hide the user's cursor for routine application UI.

`TextScramble` repeatedly substitutes random characters in a timer, then reveals the final text. Its effect does not return interval cleanup and tracks only `trigger`, so unmounting and changing text during the run require repair. Reject scrambling actual application copy by default. `TextShimmer`, `TextShimmerWave`, and `SpinningText` expose useful gradient/keyframe/circular arrangement examples, but perpetual decoration, per-character work, and readability cost do not justify dedicated default components. Prefer static project typography. Explicit exceptional use still requires pause/reduced-motion and accessible text.

## 10. Packaging, dependencies, and review

Source registry engineering is worth retaining: `scripts/registry-components.ts` declares component name, dependencies, files, and optional hook files; `registry-build.ts` embeds source contents into per-component JSON and emits a consolidated registry. The schema distinguishes UI, hooks, component, lib, and other file roles. It packages necessary local code with a reusable unit rather than asking consumers to inspect a demo. Fluidity follows that principle with local assets, references, manifests, and source-map records, not a runtime network install step.

Inspect actual imports before assigning dependency cost. Most core files use Motion + React + the source `cn` helper (`clsx` and `tailwind-merge`); dialog/carousel/toolbar code also imports Lucide icons even though some registry declarations list only Motion. InfiniteSlider, SlidingNumber, and ToolbarExpandable use `react-use-measure`. Radix dependencies in the repository package primarily support site/UI wrappers and do not automatically make the custom core components accessible. Next.js/MDX/Shiki/Geist are documentation-site dependencies, not requirements of the motion patterns.

Use the project's existing `cn` convention if adapting Tailwind-heavy code. Do not copy the global source CSS wholesale: its font mappings, dark palette, compatibility overrides, and body scroll-lock overrides are site integration choices. Local assets deliberately avoid that CSS dependency.

Review an adapted motion component against these concrete questions:

- Does one authoritative state drive visuals, semantics, callbacks, and keyboard controls? Are controlled and uncontrolled behaviors distinct and documented?
- Are keys stable and layout IDs scoped? Are preserved React state and remounted form state intentional? Does rapid reversal retarget from the current visual state?
- Does closing content lose interactivity immediately? Does focus remain meaningful through presence? Are real titles, descriptions, and controls linked?
- Is drag direct and cancellable? Are coordinate spaces consistent? Do resize, scroll, dynamic content, and touch affect measurement correctly?
- Does reduced motion remove spatial/looping motion while preserving the same operation? Are pointer-only enhancements optional?
- Are loops, timers, subscriptions, observers, animation controls, and modified global styles cleaned up? Are offscreen duplicate groups inert and hidden?
- Are timing units correct, input values finite and bounded, total stagger bounded, and source demo numbers distinguished from project choices?
- Are transform/opacity sufficient? If width, height, filter, clip-path, or backdrop-filter is needed, has real-device performance been checked at representative scale?
- Does the project retain its identity, responsive strategy, and simpler components where they serve the task? Was a complex component selected because its behavior is useful?

The inventory and classification decisions in the development source reports cover all 33 source core components. “Inspected” denotes source reading and static reasoning, not an upstream browser conformance test. Runtime browser acceptance belongs to the consuming project and the plugin's documented validation evidence.
