/**
 * Capture all DS components from Storybook
 * 
 * Usage:
 *   npx tsx scripts/capture-all-ds.ts
 * 
 * Prerequisites:
 *   1. Start Storybook: cd ../FG/turbo/packages/ds && pnpm storybook
 *   2. Run this script
 */

import { captureMultipleStories } from './capture-storybook';

// DS component stories to capture
// Format: component-name--variant
const DS_STORIES = [
  // Button variants
  'button--primary',
  'button--secondary', 
  'button--destructive',
  'button--outline',
  'button--ghost',
  'button--link',
  
  // Input
  'input--default',
  'input--with-label',
  'input--with-error',
  'input--disabled',
  
  // Badge
  'badge--default',
  'badge--secondary',
  'badge--destructive',
  'badge--outline',
  
  // Card
  'card--default',
  'card--with-header',
  
  // Checkbox
  'checkbox--default',
  'checkbox--checked',
  'checkbox--disabled',
  
  // Switch
  'switch--default',
  'switch--checked',
  
  // Avatar
  'avatar--default',
  'avatar--with-image',
  'avatar--fallback',
  
  // Label
  'label--default',
  
  // Separator
  'separator--horizontal',
  'separator--vertical',
];

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';
const OUTPUT_DIR = './captured/ds-components';

async function main() {
  console.log('🎨 DS Components Capture Tool');
  console.log('============================\n');
  console.log(`Storybook URL: ${STORYBOOK_URL}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Components: ${DS_STORIES.length}\n`);
  
  await captureMultipleStories(STORYBOOK_URL, DS_STORIES, OUTPUT_DIR);
}

main().catch(console.error);
