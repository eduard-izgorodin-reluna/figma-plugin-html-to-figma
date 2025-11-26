/**
 * Types for DS Component definitions
 * Used to describe components for Figma generation
 */

export interface ComponentVariant {
  name: string;
  value: string;
  styles: FigmaStyles;
}

export interface ComponentProp {
  name: string;
  type: 'string' | 'boolean' | 'enum' | 'instance';
  defaultValue?: string | boolean;
  options?: string[]; // for enum type
}

export interface FigmaStyles {
  // Layout
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  itemSpacing?: number;
  
  // Padding
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  
  // Size
  width?: number | 'FILL' | 'HUG';
  height?: number | 'FILL' | 'HUG';
  minWidth?: number;
  minHeight?: number;
  
  // Corner radius
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  
  // Fill
  fills?: FigmaFill[];
  
  // Stroke
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  
  // Effects (shadows)
  effects?: FigmaEffect[];
  
  // Typography (for text nodes)
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number | 'AUTO';
  letterSpacing?: number;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
}

export interface FigmaFill {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL';
  color?: RGB;
  opacity?: number;
  // For gradients
  gradientStops?: Array<{ color: RGB; position: number }>;
}

export interface FigmaStroke {
  type: 'SOLID';
  color: RGB;
  opacity?: number;
}

export interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  color?: RGBA;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
  visible?: boolean;
}

export interface RGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

export interface RGBA extends RGB {
  a: number; // 0-1
}

export interface ComponentChild {
  type: 'FRAME' | 'TEXT' | 'INSTANCE' | 'VECTOR';
  name: string;
  styles: FigmaStyles;
  children?: ComponentChild[];
  // For text nodes
  characters?: string;
  // For instance nodes
  componentKey?: string;
}

export interface DSComponent {
  name: string;
  description?: string;
  category: 'core' | 'form' | 'feedback' | 'navigation' | 'layout' | 'data-display' | 'overlay';
  
  // Base styles applied to all variants
  baseStyles: FigmaStyles;
  
  // Component variants (size, variant, state)
  variants: {
    [variantName: string]: {
      options: ComponentVariant[];
    };
  };
  
  // Component structure
  children: ComponentChild[];
  
  // Props that become Figma component properties
  props: ComponentProp[];
}

/**
 * Priority list for component generation
 */
export const COMPONENT_PRIORITY = {
  core: [
    'button',
    'input', 
    'textarea',
    'select',
    'checkbox',
    'switch',
    'radio-group',
    'label',
    'badge',
    'avatar',
  ],
  form: [
    'form',
    'field',
    'input-group',
    'input-otp',
  ],
  feedback: [
    'alert',
    'toast',
    'toaster',
    'progress',
    'skeleton',
    'spinner',
  ],
  navigation: [
    'tabs',
    'breadcrumb',
    'pagination',
    'menubar',
    'navigation-menu',
  ],
  layout: [
    'card',
    'separator',
    'divider',
    'container',
    'accordion',
    'collapsible',
  ],
  'data-display': [
    'table',
    'list-item',
    'calendar',
    'chart',
  ],
  overlay: [
    'dialog',
    'alert-dialog',
    'sheet',
    'drawer',
    'popover',
    'tooltip',
    'dropdown-menu',
    'context-menu',
    'hover-card',
  ],
} as const;
