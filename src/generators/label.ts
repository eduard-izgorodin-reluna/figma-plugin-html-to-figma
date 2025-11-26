/**
 * Label Component Generator
 * Based on DS: text-sm font-medium
 */

import { COLORS, FONT_SIZE } from '../mapping/tailwind-to-figma';

export function createLabel(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const states = ['default', 'required', 'disabled'];
  
  for (const state of states) {
    const label = figma.createComponent();
    label.name = `state=${state}`;
    
    // Auto-size
    label.layoutMode = 'HORIZONTAL';
    label.primaryAxisSizingMode = 'AUTO';
    label.counterAxisSizingMode = 'AUTO';
    label.itemSpacing = 4;
    
    // Label text
    const text = figma.createText();
    text.name = 'label';
    text.characters = 'Label';
    text.fontSize = FONT_SIZE.sm.size;  // text-sm
    text.fontName = { family: 'Inter', style: 'Medium' };  // font-medium
    
    if (state === 'disabled') {
      text.fills = [{ type: 'SOLID', color: COLORS['muted-foreground'] }];
      label.opacity = 0.7;
    } else {
      text.fills = [{ type: 'SOLID', color: COLORS.foreground }];
    }
    
    label.appendChild(text);
    
    // Required asterisk
    if (state === 'required') {
      const asterisk = figma.createText();
      asterisk.name = 'required';
      asterisk.characters = '*';
      asterisk.fontSize = FONT_SIZE.sm.size;
      asterisk.fills = [{ type: 'SOLID', color: COLORS.destructive }];
      
      label.appendChild(asterisk);
    }
    
    components.push(label);
  }
  
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Label';
  componentSet.description = 'Form label - text-sm font-medium';
  
  return componentSet;
}
