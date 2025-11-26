/**
 * Tailwind CSS → Figma Properties Converter
 * 
 * Parses Tailwind classes and converts them to Figma node properties.
 * This is the core engine for DS → Figma generation.
 */

// Import auto-generated tokens from theme CSS files
import {
  COLORS as GENERATED_COLORS,
  SPACING as GENERATED_SPACING,
  RADIUS as GENERATED_RADIUS,
  FONT_SIZE as GENERATED_FONT_SIZE,
  FONT_WEIGHT as GENERATED_FONT_WEIGHT,
} from './design-tokens.generated';

// ============================================
// TYPES
// ============================================

export interface FigmaFrameProps {
  // Layout
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  layoutWrap?: 'NO_WRAP' | 'WRAP';
  
  // Sizing
  width?: number | 'FILL' | 'HUG';
  height?: number | 'FILL' | 'HUG';
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  
  // Spacing
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  
  // Visual
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  opacity?: number;
  
  // Effects
  effects?: FigmaEffect[];
}

export interface FigmaTextProps {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing?: number;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  fills?: FigmaFill[];
}

export interface FigmaFill {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL';
  color?: RGB;
  opacity?: number;
  gradientStops?: { position: number; color: RGBA }[];
}

export interface FigmaStroke {
  type: 'SOLID';
  color: RGB;
  opacity?: number;
}

export interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'BLUR';
  color?: RGBA;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
  visible?: boolean;
  blendMode?: string;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

// ============================================
// DESIGN TOKENS (from themes/base.css + family.css)
// ============================================

// ============================================
// COLORS (merged: auto-generated + additional)
// ============================================

export const COLORS: Record<string, RGB> = {
  // Auto-generated from CSS theme
  ...GENERATED_COLORS,
  
  // Additional colors not in theme (legacy/utility)
  'advisor-primary': { r: 0.145, g: 0.388, b: 0.922 }, // #2563EB
  error: { r: 0.8, g: 0.02, b: 0.02 },
  info: { r: 0, g: 0.412, b: 0.82 }, // #0069D1
  DEFAULT: { r: 0.071, g: 0.071, b: 0.071 }, // same as foreground
};

// ============================================
// SPACING SCALE (auto-generated from theme)
// ============================================

export const SPACING: Record<string, number> = GENERATED_SPACING;

// ============================================
// BORDER RADIUS (auto-generated + fallbacks)
// ============================================

export const RADIUS: Record<string, number> = {
  ...GENERATED_RADIUS,
  'none': 0,
  'DEFAULT': GENERATED_RADIUS['md'] || 6,
  '3xl': 24,
};

// ============================================
// FONT SIZES (auto-generated + fallbacks)
// ============================================

export const FONT_SIZE: Record<string, { size: number; lineHeight: number }> = {
  ...GENERATED_FONT_SIZE,
  '5xl': { size: 48, lineHeight: 48 },
  '6xl': { size: 60, lineHeight: 60 },
};

// ============================================
// FONT WEIGHTS (auto-generated + fallbacks)
// ============================================

export const FONT_WEIGHT: Record<string, number> = {
  ...GENERATED_FONT_WEIGHT,
  'thin': 100,
  'extralight': 200,
  'light': 300,
  'normal': 400,
  'extrabold': 800,
  'black': 900,
};

// ============================================
// SHADOWS (Tailwind)
// ============================================

export const SHADOWS: Record<string, FigmaEffect[]> = {
  'sm': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 1 },
    radius: 2,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }],
  'DEFAULT': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 1 },
    radius: 3,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 1 },
    radius: 2,
    spread: -1,
    visible: true,
    blendMode: 'NORMAL',
  }],
  'md': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 4 },
    radius: 6,
    spread: -1,
    visible: true,
    blendMode: 'NORMAL',
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 4,
    spread: -2,
    visible: true,
    blendMode: 'NORMAL',
  }],
  'lg': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 10 },
    radius: 15,
    spread: -3,
    visible: true,
    blendMode: 'NORMAL',
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 4 },
    radius: 6,
    spread: -4,
    visible: true,
    blendMode: 'NORMAL',
  }],
  'xl': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 20 },
    radius: 25,
    spread: -5,
    visible: true,
    blendMode: 'NORMAL',
  }, {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 8 },
    radius: 10,
    spread: -6,
    visible: true,
    blendMode: 'NORMAL',
  }],
  '2xl': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.25 },
    offset: { x: 0, y: 25 },
    radius: 50,
    spread: -12,
    visible: true,
    blendMode: 'NORMAL',
  }],
  'xs': [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.05 },
    offset: { x: 0, y: 1 },
    radius: 1,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }],
  'none': [],
};

// ============================================
// MAIN PARSER CLASS
// ============================================

export class TailwindToFigmaParser {
  private classes: string[] = [];
  private frameProps: Partial<FigmaFrameProps> = {};
  private textProps: Partial<FigmaTextProps> = {};
  
  constructor(classString: string) {
    // Parse class string, handle responsive prefixes
    this.classes = classString
      .split(/\s+/)
      .filter(Boolean)
      .map(c => c.trim())
      // Remove responsive prefixes for now (sm:, md:, lg:, etc.)
      .map(c => c.replace(/^(sm|md|lg|xl|2xl):/, ''))
      // Remove state prefixes (hover:, focus:, etc.)
      .map(c => c.replace(/^(hover|focus|active|disabled|group-hover):/, ''))
      // Remove dark mode prefix
      .map(c => c.replace(/^dark:/, ''));
    
    this.parse();
  }
  
  private parse(): void {
    for (const cls of this.classes) {
      this.parseClass(cls);
    }
  }
  
  private parseClass(cls: string): void {
    // Skip empty or complex selectors
    if (!cls || cls.includes('[') || cls.includes('&')) return;
    
    // ========== DISPLAY / LAYOUT ==========
    if (cls === 'flex') {
      this.frameProps.layoutMode = 'HORIZONTAL';
    }
    if (cls === 'inline-flex') {
      this.frameProps.layoutMode = 'HORIZONTAL';
    }
    if (cls === 'flex-col' || cls === 'flex-column') {
      this.frameProps.layoutMode = 'VERTICAL';
    }
    if (cls === 'flex-row') {
      this.frameProps.layoutMode = 'HORIZONTAL';
    }
    if (cls === 'flex-wrap') {
      this.frameProps.layoutWrap = 'WRAP';
    }
    
    // ========== ALIGNMENT ==========
    if (cls === 'items-start') {
      this.frameProps.counterAxisAlignItems = 'MIN';
    }
    if (cls === 'items-center') {
      this.frameProps.counterAxisAlignItems = 'CENTER';
    }
    if (cls === 'items-end') {
      this.frameProps.counterAxisAlignItems = 'MAX';
    }
    if (cls === 'items-baseline') {
      this.frameProps.counterAxisAlignItems = 'BASELINE';
    }
    
    if (cls === 'justify-start') {
      this.frameProps.primaryAxisAlignItems = 'MIN';
    }
    if (cls === 'justify-center') {
      this.frameProps.primaryAxisAlignItems = 'CENTER';
    }
    if (cls === 'justify-end') {
      this.frameProps.primaryAxisAlignItems = 'MAX';
    }
    if (cls === 'justify-between') {
      this.frameProps.primaryAxisAlignItems = 'SPACE_BETWEEN';
    }
    
    // ========== SIZING ==========
    // Height: h-{value}
    const heightMatch = cls.match(/^h-(\d+\.?\d*|px|full|screen|auto|fit)$/);
    if (heightMatch) {
      const val = heightMatch[1];
      if (val === 'full' || val === 'screen') {
        this.frameProps.height = 'FILL';
      } else if (val === 'auto' || val === 'fit') {
        this.frameProps.height = 'HUG';
      } else if (SPACING[val] !== undefined) {
        this.frameProps.height = SPACING[val];
      }
    }
    
    // Width: w-{value}
    const widthMatch = cls.match(/^w-(\d+\.?\d*|px|full|screen|auto|fit)$/);
    if (widthMatch) {
      const val = widthMatch[1];
      if (val === 'full' || val === 'screen') {
        this.frameProps.width = 'FILL';
      } else if (val === 'auto' || val === 'fit') {
        this.frameProps.width = 'HUG';
      } else if (SPACING[val] !== undefined) {
        this.frameProps.width = SPACING[val];
      }
    }
    
    // Size (width + height): size-{value}
    const sizeMatch = cls.match(/^size-(\d+\.?\d*|px|full)$/);
    if (sizeMatch) {
      const val = sizeMatch[1];
      if (SPACING[val] !== undefined) {
        this.frameProps.width = SPACING[val];
        this.frameProps.height = SPACING[val];
      }
    }
    
    // Min/Max width/height
    const minWMatch = cls.match(/^min-w-(\d+\.?\d*)$/);
    if (minWMatch && SPACING[minWMatch[1]]) {
      this.frameProps.minWidth = SPACING[minWMatch[1]];
    }
    
    const maxWMatch = cls.match(/^max-w-(\d+\.?\d*)$/);
    if (maxWMatch && SPACING[maxWMatch[1]]) {
      this.frameProps.maxWidth = SPACING[maxWMatch[1]];
    }
    
    // ========== PADDING ==========
    // p-{value} (all sides)
    const paddingAllMatch = cls.match(/^p-(\d+\.?\d*|px)$/);
    if (paddingAllMatch && SPACING[paddingAllMatch[1]] !== undefined) {
      const p = SPACING[paddingAllMatch[1]];
      this.frameProps.paddingTop = p;
      this.frameProps.paddingRight = p;
      this.frameProps.paddingBottom = p;
      this.frameProps.paddingLeft = p;
    }
    
    // px-{value} (horizontal)
    const paddingXMatch = cls.match(/^px-(\d+\.?\d*|px)$/);
    if (paddingXMatch && SPACING[paddingXMatch[1]] !== undefined) {
      const p = SPACING[paddingXMatch[1]];
      this.frameProps.paddingLeft = p;
      this.frameProps.paddingRight = p;
    }
    
    // py-{value} (vertical)
    const paddingYMatch = cls.match(/^py-(\d+\.?\d*|px)$/);
    if (paddingYMatch && SPACING[paddingYMatch[1]] !== undefined) {
      const p = SPACING[paddingYMatch[1]];
      this.frameProps.paddingTop = p;
      this.frameProps.paddingBottom = p;
    }
    
    // Individual padding
    const ptMatch = cls.match(/^pt-(\d+\.?\d*|px)$/);
    if (ptMatch && SPACING[ptMatch[1]] !== undefined) {
      this.frameProps.paddingTop = SPACING[ptMatch[1]];
    }
    
    const prMatch = cls.match(/^pr-(\d+\.?\d*|px)$/);
    if (prMatch && SPACING[prMatch[1]] !== undefined) {
      this.frameProps.paddingRight = SPACING[prMatch[1]];
    }
    
    const pbMatch = cls.match(/^pb-(\d+\.?\d*|px)$/);
    if (pbMatch && SPACING[pbMatch[1]] !== undefined) {
      this.frameProps.paddingBottom = SPACING[pbMatch[1]];
    }
    
    const plMatch = cls.match(/^pl-(\d+\.?\d*|px)$/);
    if (plMatch && SPACING[plMatch[1]] !== undefined) {
      this.frameProps.paddingLeft = SPACING[plMatch[1]];
    }
    
    // ========== GAP (itemSpacing) ==========
    const gapMatch = cls.match(/^gap-(\d+\.?\d*|px)$/);
    if (gapMatch && SPACING[gapMatch[1]] !== undefined) {
      this.frameProps.itemSpacing = SPACING[gapMatch[1]];
    }
    
    // ========== BORDER RADIUS ==========
    if (cls === 'rounded') {
      this.frameProps.cornerRadius = RADIUS['DEFAULT'];
    }
    if (cls === 'rounded-none') {
      this.frameProps.cornerRadius = 0;
    }
    if (cls === 'rounded-full') {
      this.frameProps.cornerRadius = RADIUS['full'];
    }
    
    const roundedMatch = cls.match(/^rounded-(sm|md|lg|xl|2xl|3xl)$/);
    if (roundedMatch && RADIUS[roundedMatch[1]] !== undefined) {
      this.frameProps.cornerRadius = RADIUS[roundedMatch[1]];
    }
    
    // ========== BACKGROUND COLORS ==========
    // Extended matcher for all semantic colors
    const bgMatch = cls.match(/^bg-(primary|secondary|destructive|muted|accent|background|card|popover|success|warning|error|info|white|black|transparent)(-foreground)?$/);
    if (bgMatch) {
      let colorKey = bgMatch[1];
      if (bgMatch[2]) {
        colorKey = `${colorKey}-foreground`;
      }
      const color = COLORS[colorKey as keyof typeof COLORS];
      if (color) {
        this.frameProps.fills = [{
          type: 'SOLID',
          color: { r: color.r, g: color.g, b: color.b },
          opacity: 1,
        }];
      }
    }
    
    // Handle bg-input specifically
    if (cls === 'bg-input') {
      this.frameProps.fills = [{
        type: 'SOLID',
        color: { r: COLORS.input.r, g: COLORS.input.g, b: COLORS.input.b },
        opacity: 1,
      }];
    }
    
    // ========== BORDER ==========
    if (cls === 'border') {
      this.frameProps.strokes = [{
        type: 'SOLID',
        color: { r: COLORS.border.r, g: COLORS.border.g, b: COLORS.border.b },
        opacity: 1,
      }];
      this.frameProps.strokeWeight = 1;
    }
    
    // Handle border-transparent
    if (cls === 'border-transparent') {
      this.frameProps.strokes = [{
        type: 'SOLID',
        color: { r: 0, g: 0, b: 0 },
        opacity: 0,
      }];
    }
    
    // Handle border colors
    const borderColorMatch = cls.match(/^border-(primary|secondary|destructive|input|border|accent)$/);
    if (borderColorMatch) {
      const colorKey = borderColorMatch[1] as keyof typeof COLORS;
      const color = COLORS[colorKey];
      if (color) {
        this.frameProps.strokes = [{
          type: 'SOLID',
          color: { r: color.r, g: color.g, b: color.b },
          opacity: 1,
        }];
        if (this.frameProps.strokeWeight === undefined) {
          this.frameProps.strokeWeight = 1;
        }
      }
    }
    
    const borderWidthMatch = cls.match(/^border-(\d+)$/);
    if (borderWidthMatch) {
      this.frameProps.strokeWeight = parseInt(borderWidthMatch[1]);
    }
    
    // ========== TEXT COLORS ==========
    // Extended matcher for all semantic text colors
    const textColorMatch = cls.match(/^text-(primary|secondary|destructive|muted|accent|foreground|card|popover|success|warning|error|info|white|black)(-foreground)?$/);
    if (textColorMatch) {
      let colorKey = textColorMatch[1];
      if (textColorMatch[2]) {
        colorKey = `${colorKey}-foreground`;
      }
      const color = COLORS[colorKey as keyof typeof COLORS];
      if (color) {
        this.textProps.fills = [{
          type: 'SOLID',
          color: { r: color.r, g: color.g, b: color.b },
          opacity: 1,
        }];
      }
    }
    
    // ========== FONT SIZE ==========
    const textSizeMatch = cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/);
    if (textSizeMatch && FONT_SIZE[textSizeMatch[1]]) {
      const { size, lineHeight } = FONT_SIZE[textSizeMatch[1]];
      this.textProps.fontSize = size;
      this.textProps.lineHeight = { value: lineHeight, unit: 'PIXELS' };
    }
    
    // ========== FONT WEIGHT ==========
    const fontWeightMatch = cls.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/);
    if (fontWeightMatch && FONT_WEIGHT[fontWeightMatch[1]]) {
      this.textProps.fontWeight = FONT_WEIGHT[fontWeightMatch[1]];
    }
    
    // ========== TEXT DECORATION ==========
    if (cls === 'underline') {
      this.textProps.textDecoration = 'UNDERLINE';
    }
    if (cls === 'line-through') {
      this.textProps.textDecoration = 'STRIKETHROUGH';
    }
    if (cls === 'no-underline') {
      this.textProps.textDecoration = 'NONE';
    }
    
    // ========== TEXT TRANSFORM ==========
    if (cls === 'uppercase') {
      this.textProps.textCase = 'UPPER';
    }
    if (cls === 'lowercase') {
      this.textProps.textCase = 'LOWER';
    }
    if (cls === 'capitalize') {
      this.textProps.textCase = 'TITLE';
    }
    
    // ========== TEXT ALIGNMENT ==========
    if (cls === 'text-left') {
      this.textProps.textAlignHorizontal = 'LEFT';
    }
    if (cls === 'text-center') {
      this.textProps.textAlignHorizontal = 'CENTER';
    }
    if (cls === 'text-right') {
      this.textProps.textAlignHorizontal = 'RIGHT';
    }
    
    // ========== SHADOWS ==========
    if (cls === 'shadow') {
      this.frameProps.effects = SHADOWS['DEFAULT'];
    }
    const shadowMatch = cls.match(/^shadow-(xs|sm|md|lg|xl|2xl|none)$/);
    if (shadowMatch && SHADOWS[shadowMatch[1]]) {
      this.frameProps.effects = SHADOWS[shadowMatch[1]];
    }
    
    // ========== OPACITY ==========
    const opacityMatch = cls.match(/^opacity-(\d+)$/);
    if (opacityMatch) {
      this.frameProps.opacity = parseInt(opacityMatch[1]) / 100;
    }
  }
  
  /**
   * Get parsed frame properties
   */
  getFrameProps(): Partial<FigmaFrameProps> {
    return this.frameProps;
  }
  
  /**
   * Get parsed text properties
   */
  getTextProps(): Partial<FigmaTextProps> {
    return this.textProps;
  }
}

// ============================================
// UTILITY FUNCTION
// ============================================

/**
 * Parse Tailwind classes and return Figma properties
 */
export function parseTailwind(classes: string): {
  frame: Partial<FigmaFrameProps>;
  text: Partial<FigmaTextProps>;
} {
  const parser = new TailwindToFigmaParser(classes);
  return {
    frame: parser.getFrameProps(),
    text: parser.getTextProps(),
  };
}

/**
 * Apply parsed frame properties to a Figma FrameNode or ComponentNode
 */
export function applyFrameProps(node: FrameNode | ComponentNode, props: Partial<FigmaFrameProps>): void {
  // Layout
  if (props.layoutMode !== undefined) {
    node.layoutMode = props.layoutMode;
  }
  if (props.primaryAxisAlignItems !== undefined) {
    node.primaryAxisAlignItems = props.primaryAxisAlignItems;
  }
  if (props.counterAxisAlignItems !== undefined) {
    node.counterAxisAlignItems = props.counterAxisAlignItems;
  }
  if (props.primaryAxisSizingMode !== undefined) {
    node.primaryAxisSizingMode = props.primaryAxisSizingMode;
  }
  if (props.counterAxisSizingMode !== undefined) {
    node.counterAxisSizingMode = props.counterAxisSizingMode;
  }
  if (props.layoutWrap !== undefined) {
    node.layoutWrap = props.layoutWrap;
  }
  
  // Spacing
  if (props.itemSpacing !== undefined) {
    node.itemSpacing = props.itemSpacing;
  }
  if (props.paddingTop !== undefined) {
    node.paddingTop = props.paddingTop;
  }
  if (props.paddingRight !== undefined) {
    node.paddingRight = props.paddingRight;
  }
  if (props.paddingBottom !== undefined) {
    node.paddingBottom = props.paddingBottom;
  }
  if (props.paddingLeft !== undefined) {
    node.paddingLeft = props.paddingLeft;
  }
  
  // Size
  if (typeof props.width === 'number' && typeof props.height === 'number') {
    node.resize(props.width, props.height);
  } else if (typeof props.width === 'number') {
    node.resize(props.width, node.height);
  } else if (typeof props.height === 'number') {
    node.resize(node.width, props.height);
  }
  
  if (props.minWidth !== undefined) {
    node.minWidth = props.minWidth;
  }
  if (props.minHeight !== undefined) {
    node.minHeight = props.minHeight;
  }
  if (props.maxWidth !== undefined) {
    node.maxWidth = props.maxWidth;
  }
  if (props.maxHeight !== undefined) {
    node.maxHeight = props.maxHeight;
  }
  
  // Corner radius
  if (props.cornerRadius !== undefined) {
    node.cornerRadius = props.cornerRadius;
  }
  if (props.topLeftRadius !== undefined) {
    node.topLeftRadius = props.topLeftRadius;
  }
  if (props.topRightRadius !== undefined) {
    node.topRightRadius = props.topRightRadius;
  }
  if (props.bottomLeftRadius !== undefined) {
    node.bottomLeftRadius = props.bottomLeftRadius;
  }
  if (props.bottomRightRadius !== undefined) {
    node.bottomRightRadius = props.bottomRightRadius;
  }
  
  // Fills
  if (props.fills !== undefined && props.fills.length > 0) {
    const fills: SolidPaint[] = props.fills.map(fill => ({
      type: 'SOLID',
      color: fill.color || { r: 0, g: 0, b: 0 },
      opacity: fill.opacity ?? 1,
    }));
    node.fills = fills;
  }
  
  // Strokes
  if (props.strokes !== undefined && props.strokes.length > 0) {
    const strokes: SolidPaint[] = props.strokes.map(stroke => ({
      type: 'SOLID',
      color: stroke.color,
      opacity: stroke.opacity ?? 1,
    }));
    node.strokes = strokes;
  }
  if (props.strokeWeight !== undefined) {
    node.strokeWeight = props.strokeWeight;
  }
  
  // Effects (shadows)
  if (props.effects !== undefined && props.effects.length > 0) {
    const effects: DropShadowEffect[] = props.effects
      .filter(e => e.type === 'DROP_SHADOW')
      .map(e => ({
        type: 'DROP_SHADOW' as const,
        color: e.color || { r: 0, g: 0, b: 0, a: 0.1 },
        offset: e.offset || { x: 0, y: 1 },
        radius: e.radius || 2,
        spread: e.spread || 0,
        visible: e.visible ?? true,
        blendMode: 'NORMAL' as const,
      }));
    node.effects = effects;
  }
  
  // Opacity
  if (props.opacity !== undefined) {
    node.opacity = props.opacity;
  }
}

/**
 * Apply parsed text properties to a Figma TextNode
 */
export function applyTextProps(node: TextNode, props: Partial<FigmaTextProps>): void {
  // Font size
  if (props.fontSize !== undefined) {
    node.fontSize = props.fontSize;
  }
  
  // Line height
  if (props.lineHeight !== undefined) {
    if (typeof props.lineHeight === 'number') {
      node.lineHeight = { value: props.lineHeight, unit: 'PIXELS' };
    } else {
      node.lineHeight = props.lineHeight;
    }
  }
  
  // Font weight (requires font name to be set)
  if (props.fontWeight !== undefined) {
    const styleMap: Record<number, string> = {
      100: 'Thin',
      200: 'ExtraLight',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'SemiBold',
      700: 'Bold',
      800: 'ExtraBold',
      900: 'Black',
    };
    const style = styleMap[props.fontWeight] || 'Regular';
    node.fontName = { family: 'Inter', style };
  }
  
  // Text decoration
  if (props.textDecoration !== undefined) {
    node.textDecoration = props.textDecoration;
  }
  
  // Text case
  if (props.textCase !== undefined) {
    node.textCase = props.textCase;
  }
  
  // Text alignment
  if (props.textAlignHorizontal !== undefined) {
    node.textAlignHorizontal = props.textAlignHorizontal;
  }
  if (props.textAlignVertical !== undefined) {
    node.textAlignVertical = props.textAlignVertical;
  }
  
  // Fills (text color)
  if (props.fills !== undefined && props.fills.length > 0) {
    const fills: SolidPaint[] = props.fills.map(fill => ({
      type: 'SOLID',
      color: fill.color || { r: 0, g: 0, b: 0 },
      opacity: fill.opacity ?? 1,
    }));
    node.fills = fills;
  }
}

/**
 * Convert hex color to RGB (0-1 range)
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}
