# Motion vocabulary

Use the closest
term; distinguish plausible alternatives instead of inventing a new name.

| Observed behavior | Term and distinction |
| --- | --- |
| Several objects enter one after another | Stagger; a small delay between peers |
| Coordinated surfaces feel like one state change | Orchestration; timing/composition, not necessarily a stagger |
| A panel grows from its button | Origin-aware animation; transform-origin ties the change to a source |
| A thumbnail travels into a detail view | Shared element transition; preserves identity across places |
| Existing objects move after the grid changes | Layout animation; reconciles old and new geometry |
| Content fades over other content in one position | Crossfade; differs from shared spatial travel |
| A shape continuously changes form | Morph; may combine layout, shape and opacity |
| Reversing navigation changes slide direction | Direction-aware transition |
| A drag resists past its boundary and returns | Rubber-banding; progressive resistance plus snap-back |
| A released object keeps moving | Momentum; release velocity continues into motion |
| A moving object can be grabbed again | Interruptibility; start from current presentation and velocity |
| Motion overshoots then settles | Spring/bounce; spring is the mechanism, bounce is the overshoot |
| Lower mass or higher pull changes response | Mass/stiffness; damping controls dissipation |
| Motion seems finished before tiny settling stops | Perceptual duration; differs from exact settling time |
| Content is uncovered behind an edge | Reveal using clip-path or mask; masks can have soft transparency |
| Background moves slower than foreground | Parallax; often removable for reduced motion |
| Frame progress follows scroll position | Scroll-driven animation; unlike a one-time scroll reveal |
| One image wipes over another | Before/after comparison slider |
| Digits roll into a new value | Number ticker/sliding number; tabular numerals stabilize widths |
| Text appears character by character | Typewriter; not suitable for delaying essential content |
| A subtle movement confirms a press | Press/tap feedback; immediate response, activation remains separate |
| A held control gradually fills | Hold-to-confirm; requires cancellation and actual commit logic |
| A repeated strip moves continuously | Marquee/infinite slider; give reading/pause alternatives |
| A shimmer appears before content arrives | Skeleton/shimmer; communicates loading, not real progress |
| Motion stutters while scripts run | Jank/dropped frames; profile animation driver and rendering work |
| GPU moves an already painted layer | Compositing; distinct from where animation values are computed |

Ease-out starts fast and settles; ease-in-out accelerates then decelerates; linear
keeps constant speed; ease-in begins slowly and usually delays feedback. Translation
moves, scale resizes the whole painted object, rotation turns it, and transform-origin
sets the anchor. These mechanics are not a reason to animate an otherwise clear UI.
