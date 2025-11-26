/**
 * AUTO-GENERATED Design Tokens
 * 
 * Extracted from packages/themes/src/base.css + family.css
 * Generated: 2025-11-26T00:43:01.780Z
 * 
 * DO NOT EDIT MANUALLY - run: node scripts/extract-tokens.mjs
 */

/**
 * COLORS - All colors are solid RGB without embedded alpha.
 * Use Paint.opacity for transparency, not color.a
 * 
 * Border/input colors: Use 0.88 gray (visible!) instead of 10% black overlay
 */
export const COLORS = {
  // Brand colors
  'primary': { r: 1.000, g: 0.494, b: 0.260 },           // #FF7E42 orange
  'primary-foreground': { r: 1.000, g: 1.000, b: 1.000 }, // white
  
  // Secondary
  'secondary': { r: 0.965, g: 0.973, b: 0.980 },          // #F7F8FA light gray
  'secondary-foreground': { r: 0.071, g: 0.071, b: 0.071 }, // #121212 dark
  
  // Destructive
  'destructive': { r: 0.800, g: 0.020, b: 0.020 },        // #CC0505 red
  'destructive-foreground': { r: 1.000, g: 1.000, b: 1.000 },
  
  // Muted
  'muted': { r: 0.965, g: 0.973, b: 0.980 },              // #F7F8FA
  'muted-foreground': { r: 0.450, g: 0.450, b: 0.450 },   // #737373 - 50% gray (VISIBLE!)
  
  // Accent (same as primary)
  'accent': { r: 1.000, g: 0.494, b: 0.260 },
  'accent-foreground': { r: 1.000, g: 1.000, b: 1.000 },
  
  // Base
  'background': { r: 1.000, g: 1.000, b: 1.000 },         // white
  'foreground': { r: 0.071, g: 0.071, b: 0.071 },         // #121212
  
  // Card
  'card': { r: 1.000, g: 1.000, b: 1.000 },
  'card-foreground': { r: 0.071, g: 0.071, b: 0.071 },
  
  // Popover
  'popover': { r: 1.000, g: 1.000, b: 1.000 },
  'popover-foreground': { r: 0.071, g: 0.071, b: 0.071 },
  
  // IMPORTANT: Border/Input - use VISIBLE gray color, not 10% overlay!
  'border': { r: 0.878, g: 0.878, b: 0.878 },             // #E0E0E0 - VISIBLE gray border
  'input': { r: 0.878, g: 0.878, b: 0.878 },              // #E0E0E0 - same
  
  // Ring (focus)
  'ring': { r: 1.000, g: 0.494, b: 0.260 },               // orange
  
  // Status colors
  'success': { r: 0.110, g: 0.651, b: 0.576 },            // #1CA693 teal
  'success-foreground': { r: 1.000, g: 1.000, b: 1.000 },
  'warning': { r: 0.918, g: 0.627, b: 0.000 },            // #EAA000 amber
  'warning-foreground': { r: 0.000, g: 0.000, b: 0.000 },
  
  // Utility
  'white': { r: 1.000, g: 1.000, b: 1.000 },
  'black': { r: 0.000, g: 0.000, b: 0.000 },
  'transparent': { r: 0.000, g: 0.000, b: 0.000 },        // use with opacity: 0
} as Record<string, { r: number; g: number; b: number }>;

export const SPACING: Record<string, number> = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
  '36': 144,
  '40': 160,
  '44': 176,
  '48': 192,
  '52': 208,
  '56': 224,
  '60': 240,
  '64': 256,
  '72': 288,
  '80': 320,
  '96': 384,
  'px': 1,
  '0.5': 2,
  '1.5': 6,
  '2.5': 10,
  '3.5': 14,
};

export const RADIUS: Record<string, number> = {
  'sm': 4,
  'md': 6,
  'lg': 8,
  'xl': 12,
  '2xl': 16,
  'full': 9999,
};

export const FONT_SIZE: Record<string, { size: number; lineHeight: number }> = {
  'xs': { size: 12, lineHeight: 17 },
  'sm': { size: 14, lineHeight: 20 },
  'base': { size: 16, lineHeight: 22 },
  'lg': { size: 18, lineHeight: 25 },
  'xl': { size: 20, lineHeight: 28 },
  '2xl': { size: 24, lineHeight: 34 },
  '3xl': { size: 32, lineHeight: 45 },
  '4xl': { size: 50, lineHeight: 70 },
};

export const FONT_WEIGHT: Record<string, number> = {
  'regular': 400,
  'medium': 500,
  'semibold': 600,
  'bold': 700,
};

// Type exports
export type ColorKey = keyof typeof COLORS;
export type SpacingKey = keyof typeof SPACING;
export type RadiusKey = keyof typeof RADIUS;
