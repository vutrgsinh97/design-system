# Front-end package review

Adapted for this UI library from the [Front-End Checklist](https://github.com/thedaviddias/Front-End-Checklist). Apply only items relevant to the changed component or package. Site-level SEO, metadata, and PWA checks belong to consumer apps.

## Public API and compatibility

- [ ] New exports are intentional and documented; internal files remain private.
- [ ] Props follow existing `variant`, `size`, native attribute, ref, and controlled/uncontrolled conventions.
- [ ] React and React DOM remain peer dependencies; no second React is bundled.
- [ ] Next.js Server/Client boundary is correct; `'use client'` is limited to interactive entry points.
- [ ] The packed tarball contains JS, declarations, CSS, and no source-only imports.

## HTML, accessibility, and interaction

- [ ] Native semantic elements are used where available.
- [ ] Controls have accessible names, labels, errors, and disabled states as needed.
- [ ] Keyboard navigation, focus visibility, Escape/dismissal, and focus return work where applicable.
- [ ] Motion respects reduced-motion preferences.

## Styling and performance

- [ ] Each primitive or composite keeps implementation and CSS together in its own folder.
- [ ] Desktop and mobile composites do not depend on each other; shared primitives do not import view composites.
- [ ] Styles are scoped with `ds-` names and use shared tokens.
- [ ] Component CSS does not affect unrelated MFE elements.
- [ ] Button-only bundles use the shared primitive and exclude Dialog, Radix, and Dialog CSS; FormField-only builds exclude Card and Dialog.
- [ ] Production JS/CSS size change is measured and justified for new dependencies.
- [ ] Icons, fonts, locales, and complex controls are imported only where used.
- [ ] Icon package changes preserve per-icon subpath imports; an icon-only bundle excludes other icons.

## Verification

- [ ] TypeScript build and `pnpm check` pass.
- [ ] Both Next.js playground apps and the Vite production example build after package changes.
- [ ] Changed components have an example showing ordinary, disabled, error, and loading states where relevant.
- [ ] New behavior is checked in a browser with keyboard and an accessibility inspector.
