/**
 * Checkbox Component Generator
 * Based on DS: size-4 rounded-[4px] border
 */

import { COLORS } from '../mapping/tailwind-to-figma';

export function createCheckbox(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const states = [
    { checked: false, disabled: false },
    { checked: true, disabled: false },
    { checked: false, disabled: true },
    { checked: true, disabled: true },
  ];
  
  for (const state of states) {
    const checkbox = figma.createComponent();
    checkbox.name = `checked=${state.checked}, disabled=${state.disabled}`;
    
    // size-4 = 16px
    checkbox.resize(16, 16);
    
    // Layout
    checkbox.layoutMode = 'HORIZONTAL';
    checkbox.primaryAxisAlignItems = 'CENTER';
    checkbox.counterAxisAlignItems = 'CENTER';
    
    // rounded-[4px]
    checkbox.cornerRadius = 4;
    
    // Styling based on state
    if (state.checked) {
      checkbox.fills = [{ type: 'SOLID', color: COLORS.primary }];
      checkbox.strokes = [{ type: 'SOLID', color: COLORS.primary }];
    } else {
      checkbox.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // Белый фон
      checkbox.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]; // Серая рамка
    }
    checkbox.strokeWeight = 1;
    
    if (state.disabled) {
      checkbox.opacity = 0.5;
    }
    
    // Checkmark icon (when checked)
    if (state.checked) {
      const icon = figma.createVector();
      icon.name = 'checkmark';
      // Simple checkmark path
      icon.vectorPaths = [{
        windingRule: 'NONZERO',
        data: 'M 3 8 L 6 11 L 13 4',
      }];
      icon.resize(10, 10);
      icon.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // Белая галочка
      icon.strokeWeight = 2;
      icon.strokeCap = 'ROUND';
      icon.strokeJoin = 'ROUND';
      icon.fills = [];
      
      checkbox.appendChild(icon);
    }
    
    components.push(checkbox);
  }
  
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Checkbox';
  componentSet.description = 'Checkbox - size-4 rounded-[4px] border';
  
  return componentSet;
}
