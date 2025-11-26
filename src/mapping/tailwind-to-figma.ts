/**
 * Tailwind to Figma Style Mapping
 * Converts Tailwind classes to Figma API values
 * 
 * Now imports auto-generated tokens from CSS theme files!
 */

import type { FigmaStyles, FigmaFill, FigmaEffect, RGB, RGBA } from '../types/component';
import {
  COLORS as GENERATED_COLORS,
  SPACING as GENERATED_SPACING,
  RADIUS as GENERATED_RADIUS,
  FONT_SIZE as GENERATED_FONT_SIZE,
  FONT_WEIGHT as GENERATED_FONT_WEIGHT,
} from '../converter/design-tokens.generated';

// =============================================================================
// COLOR TOKENS (auto-generated from @reluna-fg/themes CSS)
// =============================================================================

export const COLORS: Record<string, RGB> = {
  ...GENERATED_COLORS,
  // Additional colors not in theme
  'error': GENERATED_COLORS.destructive,
  'info': { r: 0, g: 0.412, b: 0.82 }, // #0069d1
};

// Portal themes
export const PORTAL_COLORS = {
  family: { r: 0.984, g: 0.392, b: 0.157 }, // #fb6428 orange
  advisor: { r: 0, g: 0.361, b: 0.804 }, // #005CCD blue
  admin: { r: 0.561, g: 0.804, b: 0 }, // #8FCD00 lime
};

// =============================================================================
// SPACING (auto-generated from theme)
// =============================================================================

export const SPACING: Record<string, number> = GENERATED_SPACING;

// =============================================================================
// BORDER RADIUS (auto-generated from theme)
// =============================================================================

export const RADIUS: Record<string, number> = {
  ...GENERATED_RADIUS,
  'none': 0,
  '': GENERATED_RADIUS['md'] || 6, // default
  '3xl': 24,
};

// =============================================================================
// FONT SIZES (auto-generated + fallbacks)
// =============================================================================

export const FONT_SIZE: Record<string, { size: number; lineHeight: number }> = {
  ...GENERATED_FONT_SIZE,
  '5xl': { size: 48, lineHeight: 48 },
  '6xl': { size: 60, lineHeight: 60 },
};

// =============================================================================
// FONT WEIGHTS (auto-generated + fallbacks)
// =============================================================================

export const FONT_WEIGHT: Record<string, number> = {
  ...GENERATED_FONT_WEIGHT,
  'thin': 100,
  'extralight': 200,
  'light': 300,
  'normal': GENERATED_FONT_WEIGHT['regular'] || 400,
  'extrabold': 800,
  'black': 900,
};

// =============================================================================
// SHADOWS
// =============================================================================

export const SHADOWS: Record<string, FigmaEffect[]> = {
  'sm': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 1 },
    radius: 2,
    spread: 0,
    visible: true,
  }],
  '': [{ // default shadow
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 1 },
    radius: 3,
    spread: 0,
    visible: true,
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 1 },
    radius: 2,
    spread: 0,
    visible: true,
  }],
  'md': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 4 },
    radius: 6,
    spread: -1,
    visible: true,
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 2 },
    radius: 4,
    spread: -1,
    visible: true,
  }],
  'lg': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 10 },
    radius: 15,
    spread: -3,
    visible: true,
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 4 },
    radius: 6,
    spread: -2,
    visible: true,
  }],
  'xl': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 20 },
    radius: 25,
    spread: -5,
    visible: true,
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.04 },
    offset: { x: 0, y: 10 },
    radius: 10,
    spread: -5,
    visible: true,
  }],
  'none': [],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse Tailwind class and return Figma style property
 */
export function parseTailwindClass(className: string): Partial<FigmaStyles> {
  const styles: Partial<FigmaStyles> = {};
  
  // Padding
  if (className.startsWith('p-')) {
    const value = SPACING[className.slice(2)] || 0;
    styles.paddingTop = value;
    styles.paddingRight = value;
    styles.paddingBottom = value;
    styles.paddingLeft = value;
  } else if (className.startsWith('px-')) {
    const value = SPACING[className.slice(3)] || 0;
    styles.paddingRight = value;
    styles.paddingLeft = value;
  } else if (className.startsWith('py-')) {
    const value = SPACING[className.slice(3)] || 0;
    styles.paddingTop = value;
    styles.paddingBottom = value;
  } else if (className.startsWith('pt-')) {
    styles.paddingTop = SPACING[className.slice(3)] || 0;
  } else if (className.startsWith('pr-')) {
    styles.paddingRight = SPACING[className.slice(3)] || 0;
  } else if (className.startsWith('pb-')) {
    styles.paddingBottom = SPACING[className.slice(3)] || 0;
  } else if (className.startsWith('pl-')) {
    styles.paddingLeft = SPACING[className.slice(3)] || 0;
  }
  
  // Gap/Spacing
  if (className.startsWith('gap-')) {
    styles.itemSpacing = SPACING[className.slice(4)] || 0;
  }
  
  // Border radius
  if (className.startsWith('rounded')) {
    if (className === 'rounded') {
      styles.cornerRadius = RADIUS[''];
    } else if (className.startsWith('rounded-')) {
      const size = className.slice(8);
      styles.cornerRadius = RADIUS[size] ?? 4;
    }
  }
  
  // Background color
  if (className.startsWith('bg-')) {
    const colorName = className.slice(3);
    const color = COLORS[colorName];
    if (color) {
      styles.fills = [{ type: 'SOLID', color, opacity: 1 }];
    }
  }
  
  // Text color
  if (className.startsWith('text-') && !className.startsWith('text-[')) {
    const parts = className.slice(5).split('-');
    // Check if it's a size (xs, sm, base, lg, etc.)
    if (FONT_SIZE[parts[0]]) {
      const { size, lineHeight } = FONT_SIZE[parts[0]];
      styles.fontSize = size;
      styles.lineHeight = lineHeight;
    }
  }
  
  // Font weight
  if (className.startsWith('font-')) {
    const weight = className.slice(5);
    if (FONT_WEIGHT[weight]) {
      styles.fontWeight = FONT_WEIGHT[weight];
    }
  }
  
  // Shadow
  if (className.startsWith('shadow')) {
    if (className === 'shadow') {
      styles.effects = SHADOWS[''];
    } else if (className.startsWith('shadow-')) {
      const size = className.slice(7);
      styles.effects = SHADOWS[size] || [];
    }
  }
  
  // Flex layout
  if (className === 'flex') {
    styles.layoutMode = 'HORIZONTAL';
  }
  if (className === 'flex-col') {
    styles.layoutMode = 'VERTICAL';
  }
  if (className === 'items-center') {
    styles.counterAxisAlignItems = 'CENTER';
  }
  if (className === 'justify-center') {
    styles.primaryAxisAlignItems = 'CENTER';
  }
  if (className === 'justify-between') {
    styles.primaryAxisAlignItems = 'SPACE_BETWEEN';
  }
  
  // Size
  if (className.startsWith('w-')) {
    const value = className.slice(2);
    if (value === 'full') {
      styles.width = 'FILL';
    } else if (value === 'fit') {
      styles.width = 'HUG';
    } else if (SPACING[value]) {
      styles.width = SPACING[value];
    }
  }
  if (className.startsWith('h-')) {
    const value = className.slice(2);
    if (value === 'full') {
      styles.height = 'FILL';
    } else if (value === 'fit') {
      styles.height = 'HUG';
    } else if (SPACING[value]) {
      styles.height = SPACING[value];
    }
  }
  
  return styles;
}

/**
 * Parse multiple Tailwind classes and merge styles
 */
export function parseTailwindClasses(classNames: string): FigmaStyles {
  const classes = classNames.split(/\s+/).filter(Boolean);
  let styles: FigmaStyles = {};
  
  for (const className of classes) {
    const parsed = parseTailwindClass(className);
    styles = { ...styles, ...parsed };
  }
  
  return styles;
}

/**
 * Convert hex color to RGB (0-1 range)
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return { r: f(0), g: f(8), b: f(4) };
}
