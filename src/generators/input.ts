/**
 * Input Component Generator
 * Based on DS: h-9 rounded-md border px-3 py-1
 */

import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../mapping/tailwind-to-figma';

export function createInput(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const states = ['default', 'focused', 'disabled', 'error'];
  
  for (const state of states) {
    const input = figma.createComponent();
    input.name = `state=${state}`;
    
    // h-9 = 36px, full width
    input.resize(280, 36);
    
    // Auto-layout horizontal
    input.layoutMode = 'HORIZONTAL';
    input.primaryAxisAlignItems = 'MIN';
    input.counterAxisAlignItems = 'CENTER';
    input.paddingLeft = SPACING['3'];  // px-3
    input.paddingRight = SPACING['3'];
    input.paddingTop = SPACING['1'];   // py-1
    input.paddingBottom = SPACING['1'];
    
    // Border - rounded-md = 6px
    input.cornerRadius = RADIUS.md;
    
    // Background белый
    input.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // State-specific styles - используем видимые цвета
    if (state === 'default') {
      input.strokes = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }]; // Светло-серая рамка
      input.strokeWeight = 1;
    } else if (state === 'focused') {
      input.strokes = [{ type: 'SOLID', color: COLORS.primary }]; // Оранжевая рамка
      input.strokeWeight = 2;
      input.effects = [{
        type: 'DROP_SHADOW',
        color: { r: COLORS.primary.r, g: COLORS.primary.g, b: COLORS.primary.b, a: 0.3 },
        offset: { x: 0, y: 0 },
        radius: 4,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      }];
    } else if (state === 'disabled') {
      input.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      input.strokeWeight = 1;
      input.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }]; // Слегка серый фон
      input.opacity = 0.7;
    } else if (state === 'error') {
      input.strokes = [{ type: 'SOLID', color: COLORS.destructive }]; // Красная рамка
      input.strokeWeight = 1;
    }
    
    // Placeholder text layer
    const placeholder = figma.createText();
    placeholder.name = 'placeholder';
    placeholder.characters = 'Enter text...';
    placeholder.fontSize = FONT_SIZE.sm.size;
    placeholder.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]; // Серый placeholder
    placeholder.layoutGrow = 1;
    
    input.appendChild(placeholder);
    components.push(input);
  }
  
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Input';
  componentSet.description = 'Text input field - h-9 rounded-md border px-3';
  
  return componentSet;
}
