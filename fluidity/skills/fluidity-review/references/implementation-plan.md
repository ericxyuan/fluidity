# Self-contained implementation plan recipe

Derived from the design guidance's improve-animations PLAN-TEMPLATE.md. Use for requested plans or
delegated implementation; do not impose a plan stage on a small authorized fix.

Record the current repository revision (if available), exact affected file paths,
the triggering interaction, current behavior and observed consequence. Include a
small current-code excerpt where it prevents ambiguity. Define the target behavior
with concrete state transitions, accessibility/focus behavior, interruption and
reduced-motion handling. Spell out exact token values only where the change needs
them; otherwise name the existing project token and its current value.

Give ordered implementation steps, dependencies between changes, a host-project
exemplar and boundaries that protect unrelated work. Include meaningful mechanical
checks and the exact interaction to exercise visually: for example, open the panel,
close halfway through entry, reopen, and confirm focus returns without a jump. Define
done as observable behavior, not a prose checklist or a line count.

When code has drifted, re-inspect and revise the plan instead of blindly applying stale
line references. Pause only for a material ambiguity outside existing authorization.
Consolidate findings that share the same cause/fix; keep independent changes separate.
