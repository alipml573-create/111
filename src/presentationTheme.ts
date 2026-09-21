import type { CSSProperties } from 'react';

export const backgroundAssets = {
  cover: 'assets/cover-campus-v4/campus-reference.webp',
  landscape: 'assets/ambient-v5/landscape.webp',
  panels: 'assets/ambient-v5/panels.webp',
  arch: 'assets/ambient-v5/arch.webp',
  ribbon: 'assets/ambient-v5/ribbon.webp',
  loop: 'assets/ambient-v5/loop.webp',
  academic: 'assets/academic-campus-v1/campus-background.webp',
  interview: 'assets/interview-campus-v2/campus-background.webp',
  shangmei: 'assets/shangmei-campus-v2/campus-background.webp',
  netjoy: 'assets/netjoy-studio-v2/studio-background.webp',
  guangdong: 'assets/guangdong-campus-v2/studio-background.webp',
  portfolio: 'assets/portfolio-campus-v2/campus-stage.webp',
  competition: 'assets/competition-campus-v1/campus-background.webp',
  values: 'assets/values-campus-v1/campus-background.webp',
  honors: 'assets/honors-campus-v1/campus-background.webp',
  campusAction: 'assets/campus-action-v1/campus-background.webp',
  court: 'assets/court-campus-v1/courthouse-background.webp',
  innovation: 'assets/innovation-campus-v1/innovation-background.webp',
  ending: 'assets/ending-campus-v1/campus-city-background.webp',
} as const;

// Backgrounds are non-factual decoration. Narrative pages have a landscape;
// proof-heavy pages have quieter panels, creative pages have abstract forms.
export const slideScenes = [
  'cover', 'academic', 'interview', 'shangmei', 'netjoy',
  'guangdong', 'loop', 'portfolio', 'competition', 'values',
  'honors', 'campusAction', 'court', 'innovation', 'ending',
] as const satisfies readonly (keyof typeof backgroundAssets)[];

// Resolve against the document before putting a URL inside a CSS variable:
// otherwise CSS resolves './assets' against the bundled /assets/*.css file.
const assetBase = new URL(import.meta.env.BASE_URL, document.baseURI);
export const slideBackgroundStyles = slideScenes.map(scene => ({
  '--scene-background': `url("${new URL(backgroundAssets[scene], assetBase).href}")`,
}) as CSSProperties);
