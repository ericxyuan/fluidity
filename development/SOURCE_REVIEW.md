# Source extraction coverage

All repositories were cloned and read locally before their respective guidance and
adapters were written. These are the pinned build-time snapshots; normal plugin use
does not fetch or consult them.

| Source | Snapshot | Study scope | Incorporated locally |
| --- | --- | --- | --- |
| Motion Patterns | 40f59b61e567712aa8329c7dc8c2ced763054c34 | All 33 core component implementations, both hooks, registry/build/schema plus representative docs/examples; 95 example paths inventoried | Six adapters plus detailed presence, layout, shared-element, text, gesture, observer, comparison and registry recipes |
| Composition Patterns | 3b855612fb524cb042cc91b65f0cd575057471cc | 78 registered UI entries inventoried; 24 component source files inspected; compound APIs, hooks, docs, examples, styles and bundled component guidance | Persistent measured disclosure, directional tabs, measurement/outside-interaction hooks and card/drawer/toolbar/reorder recipes |
| Design author skills | d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7 | Core design, Apple behavior, animation recipes, review/audit/plans, opportunities, vocabulary, dependency judgment and prototype material; native material scoped separately | Shared motion policy, behavioral foundations, gesture mechanics, design/review criteria, vocabulary, orchestration and extension rationale |
| Application Platform | 8a29318ef09a97ba821cd711786ab6e241c96a57 | 131 animated patterns and 30 base categories inventoried; 19 animated patterns deeply inspected plus selected primitives, state hooks, registry and application source | Inline edit, controllable state, pagination/selection models; substantial controls, menus, navigation, overlays, table, data and specialized application recipes |

The [source map](source-map.json) contains 96 capability decisions. Each identifies
source paths at the pinned revision, original name, retained/generalized/modified/
rejected behavior and local output. Component candidates include the
requested CORE/SPECIALIZED/REFERENCE/REJECT classification and evaluation dimensions.
Catalog-only entries are expressly marked provisional/uninspected; they are not silently
accepted into the runtime system. The goal was useful preserved knowledge, not imports.

Read the per-source reports for evidence and coverage limits:

- [Motion Patterns](sources/motion-patterns.json)
- [Composition Patterns](sources/composition-patterns.json)
- [Design skills](sources/design-guidance.json)
- [Application](sources/application.json)

[Conflict decisions](conflicts.md) explain the integrated rule where source behavior
differs. [Validation evidence](VALIDATION.md) distinguishes source study from actual
local component/browser checks.
