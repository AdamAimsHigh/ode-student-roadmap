/* Subject configuration: the single master constant that makes the SPA shell
   subject-neutral (see WEBSITE_BLUEPRINT.md, "Universal SPA Content Matrix
   Specification"). The layout files (router.js, views-*.js) and the sync
   namespace in state.js read ONLY this object, never a hard-coded "ode" or a
   fixed unit count, so onboarding a future track (Linear Algebra, Calculus)
   means shipping the same shell with a different config here plus that track's
   own compiled data global. Nothing in the layout changes.

   `units` is a live accessor onto the CURRICULUM global, which is a GENERATED
   artifact emitted by scripts/compile_web.py from the content/ tree (Pillar 3,
   "edit content/, never the generated files"). Bridging rather than copying
   keeps that pipeline authoritative: the config carries the subject's identity
   and taxonomy, the compiler still owns its data. The typeof guard keeps this
   file inert if curriculum-data.js ever fails to load, matching the shell's
   defensive-degradation contract. */
const SUBJECT_CONFIG = {
    // Lowercase namespace; matches the /ode/ asset subdirectory and the
    // Worker's KNOWN_SUBJECTS registry entry that scopes progress:<subject>:*.
    subjectId: "ode",
    // Client-facing plain text for titles and headings (no em-dashes / ampersands).
    displayName: "ODE Roadmap",
    // The linguistic identifier for content groupings ("Chapter"/"Section" elsewhere).
    structureLabel: "Unit",
    // Live bridge onto the generated curriculum global; empty array before it parses.
    get units() {
        return typeof CURRICULUM !== "undefined" ? CURRICULUM : [];
    }
};
