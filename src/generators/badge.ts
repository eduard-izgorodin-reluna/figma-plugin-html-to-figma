/**
 * Badge Component Generator
 */

import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../mapping/tailwind-to-figma';

const VARIANT_CONFIG = {
  default: {
    backgroundColor: COLORS.primary,
    textColor: COLORS['primary-foreground'],
    borderColor: null,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    textColor: COLORS['secondary-foreground'],
    borderColor: null,
  },
  destructive: {
    backgroundColor: COLORS.destructive,
    textColor: COLORS['destructive-foreground'],
    borderColor: null,
  },
  outline: {
    backgroundColor: COLORS.transparent,
    textColor: COLORS.foreground,
    borderColor: COLORS.border,
  },
  success: {
    backgroundColor: COLORS.success,
    textColor: COLORS.white,
    borderColor: null,
  },
  warning: {
    backgroundColor: COLORS.warning,
    textColor: COLORS.white,
    borderColor: null,
  },
};

export function createBadge(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  for (const [variantName, variantConfig] of Object.entries(VARIANT_CONFIG)) {
    // Create badge component
    const badge = figma.createComponent();
    badge.name = `variant=${variantName}`;
    
    // Auto-layout
    badge.layoutMode = 'HORIZONTAL';
    badge.primaryAxisAlignItems = 'CENTER';
    badge.counterAxisAlignItems = 'CENTER';
    badge.paddingLeft = SPACING['2.5'];
    badge.paddingRight = SPACING['2.5'];
    badge.paddingTop = SPACING['0.5'];
    badge.paddingBottom = SPACING['0.5'];
    badge.primaryAxisSizingMode = 'AUTO';
    badge.counterAxisSizingMode = 'AUTO';
    
    // Background
    badge.fills = [{
      type: 'SOLID',
      color: variantConfig.backgroundColor,
      opacity: variantName === 'outline' ? 0 : 1,
    }];
    
    // Border for outline variant
    if (variantConfig.borderColor) {
      badge.strokes = [{
        type: 'SOLID',
        color: variantConfig.borderColor,
      }];
      badge.strokeWeight = 1;
    }
    
    // Border radius (pill shape)
    badge.cornerRadius = RADIUS.full;
    
    // Text
    const text = figma.createText();
    text.characters = 'Badge';
    text.fontSize = FONT_SIZE.xs.size;
    text.fontName = { family: 'Inter', style: 'Medium' };
    text.fills = [{
      type: 'SOLID',
      color: variantConfig.textColor,
    }];
    
    badge.appendChild(text);
    components.push(badge);
  }
  
  // Combine into component set
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Badge';
  componentSet.description = 'Status and label badges';
  
  return componentSet;
}
