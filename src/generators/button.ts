/**
 * Button Component Generator
 * Creates Figma Button component based on DS Button
 */

import type { DSComponent } from '../types/component';
import { COLORS, SPACING, RADIUS } from '../mapping/tailwind-to-figma';

/**
 * Button component definition
 * Based on packages/ds/src/Button.tsx
 */
export const buttonDefinition: DSComponent = {
  name: 'Button',
  description: 'Primary action button with multiple variants and sizes',
  category: 'core',
  
  baseStyles: {
    layoutMode: 'HORIZONTAL',
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'CENTER',
    itemSpacing: 8,
    cornerRadius: 6, // rounded-md
  },
  
  variants: {
    variant: {
      options: [
        {
          name: 'default',
          value: 'default',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['primary'], opacity: 1 }],
          },
        },
        {
          name: 'destructive',
          value: 'destructive',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['destructive'], opacity: 1 }],
          },
        },
        {
          name: 'outline',
          value: 'outline',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['background'], opacity: 1 }],
            strokes: [{ type: 'SOLID', color: COLORS['border'], opacity: 1 }],
            strokeWeight: 1,
          },
        },
        {
          name: 'secondary',
          value: 'secondary',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['secondary'], opacity: 1 }],
          },
        },
        {
          name: 'ghost',
          value: 'ghost',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['transparent'], opacity: 0 }],
          },
        },
        {
          name: 'link',
          value: 'link',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['transparent'], opacity: 0 }],
          },
        },
        {
          name: 'accent',
          value: 'accent',
          styles: {
            fills: [{ type: 'SOLID', color: COLORS['accent'], opacity: 1 }],
          },
        },
      ],
    },
    size: {
      options: [
        {
          name: 'default',
          value: 'default',
          styles: {
            height: 36, // h-9
            paddingLeft: 16, // px-4
            paddingRight: 16,
            paddingTop: 8, // py-2
            paddingBottom: 8,
          },
        },
        {
          name: 'sm',
          value: 'sm',
          styles: {
            height: 32, // h-8
            paddingLeft: 12, // px-3
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            cornerRadius: 6,
          },
        },
        {
          name: 'lg',
          value: 'lg',
          styles: {
            height: 40, // h-10
            paddingLeft: 24, // px-6
            paddingRight: 24,
            paddingTop: 8,
            paddingBottom: 8,
            cornerRadius: 6,
          },
        },
        {
          name: 'icon',
          value: 'icon',
          styles: {
            width: 36,
            height: 36,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      ],
    },
  },
  
  children: [
    {
      type: 'TEXT',
      name: 'Label',
      characters: 'Button',
      styles: {
        fontSize: 14,
        fontWeight: 500, // font-medium
        fontFamily: 'PP Object Sans',
      },
    },
  ],
  
  props: [
    {
      name: 'children',
      type: 'string',
      defaultValue: 'Button',
    },
    {
      name: 'variant',
      type: 'enum',
      defaultValue: 'default',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'accent'],
    },
    {
      name: 'size',
      type: 'enum',
      defaultValue: 'default',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false,
    },
  ],
};

/**
 * Get text color based on variant
 */
function getTextColor(variant: string): RGB {
  switch (variant) {
    case 'default':
    case 'destructive':
      return COLORS['white'];
    case 'outline':
    case 'secondary':
    case 'ghost':
    case 'accent':
      return COLORS['foreground'];
    case 'link':
      return COLORS['primary'];
    default:
      return COLORS['foreground'];
  }
}

/**
 * Create Button component in Figma
 */
export function createButton(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const variants = buttonDefinition.variants.variant.options;
  const sizes = buttonDefinition.variants.size.options;
  
  // Create component for each variant x size combination
  for (const variant of variants) {
    for (const size of sizes) {
      const component = figma.createComponent();
      component.name = `variant=${variant.name}, size=${size.name}`;
      
      // Apply base styles
      component.layoutMode = 'HORIZONTAL';
      component.primaryAxisAlignItems = 'CENTER';
      component.counterAxisAlignItems = 'CENTER';
      component.itemSpacing = 8;
      
      // Apply size styles
      if (typeof size.styles.height === 'number') {
        component.resize(
          typeof size.styles.width === 'number' ? size.styles.width : 100,
          size.styles.height
        );
      }
      component.paddingLeft = size.styles.paddingLeft || 16;
      component.paddingRight = size.styles.paddingRight || 16;
      component.paddingTop = size.styles.paddingTop || 8;
      component.paddingBottom = size.styles.paddingBottom || 8;
      component.cornerRadius = size.styles.cornerRadius || 6;
      
      // Apply variant styles (fills)
      if (variant.styles.fills) {
        component.fills = variant.styles.fills.map(fill => ({
          type: fill.type,
          color: fill.color!,
          opacity: fill.opacity,
        })) as Paint[];
      }
      
      // Apply strokes
      if (variant.styles.strokes) {
        component.strokes = variant.styles.strokes.map(stroke => ({
          type: stroke.type,
          color: stroke.color,
          opacity: stroke.opacity || 1,
        })) as Paint[];
        component.strokeWeight = variant.styles.strokeWeight || 1;
      }
      
      // Create text label
      const text = figma.createText();
      text.name = 'Label';
      text.characters = 'Button';
      text.fontSize = 14;
      text.fontName = { family: 'Inter', style: 'Medium' };
      
      // Set text color based on variant
      const textColor = getTextColor(variant.value);
      text.fills = [{ type: 'SOLID', color: textColor }];
      
      component.appendChild(text);
      
      // Size to fit content
      component.primaryAxisSizingMode = 'AUTO';
      component.counterAxisSizingMode = 'AUTO';
      
      components.push(component);
    }
  }
  
  // Combine into component set
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Button';
  componentSet.description = buttonDefinition.description || '';
  
  // Add component properties
  componentSet.addComponentProperty('Label', 'TEXT', 'Button');
  
  return componentSet;
}

// Type definitions for Figma API
interface RGB {
  r: number;
  g: number;
  b: number;
}
