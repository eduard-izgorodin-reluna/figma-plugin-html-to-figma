/**
 * Card Component Generator
 */

import { COLORS, SPACING, RADIUS } from '../mapping/tailwind-to-figma';

export function createCard(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  // Card variants
  const variants = ['default', 'bordered', 'elevated'];
  
  for (const variant of variants) {
    // Create card component
    const card = figma.createComponent();
    card.name = `variant=${variant}`;
    
    // Set default size
    card.resize(320, 200);
    
    // Auto-layout (vertical)
    card.layoutMode = 'VERTICAL';
    card.primaryAxisAlignItems = 'MIN';
    card.counterAxisAlignItems = 'MIN';
    card.paddingLeft = SPACING['6'];
    card.paddingRight = SPACING['6'];
    card.paddingTop = SPACING['6'];
    card.paddingBottom = SPACING['6'];
    card.itemSpacing = SPACING['4'];
    
    // Background - белый
    card.fills = [{
      type: 'SOLID',
      color: { r: 1, g: 1, b: 1 }, // Явно белый
    }];
    
    // Border radius
    card.cornerRadius = RADIUS.lg;
    
    // Все варианты имеют рамку для видимости
    card.strokes = [{
      type: 'SOLID',
      color: { r: 0.9, g: 0.9, b: 0.9 }, // Светло-серая рамка
    }];
    card.strokeWeight = 1;
    
    if (variant === 'elevated') {
      card.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 4 },
        radius: 6,
        spread: -1,
        visible: true,
        blendMode: 'NORMAL',
      }];
    }
    
    // Card Header
    const header = figma.createFrame();
    header.name = 'Header';
    header.layoutMode = 'VERTICAL';
    header.itemSpacing = SPACING['1.5'];
    header.fills = [];
    header.layoutSizingHorizontal = 'FILL';
    header.primaryAxisSizingMode = 'AUTO';
    header.counterAxisSizingMode = 'AUTO';
    
    // Title
    const title = figma.createText();
    title.characters = 'Card Title';
    title.fontSize = 18;
    title.fontName = { family: 'Inter', style: 'Bold' };
    title.fills = [{
      type: 'SOLID',
      color: COLORS.foreground,
    }];
    header.appendChild(title);
    
    // Description
    const description = figma.createText();
    description.characters = 'Card description goes here';
    description.fontSize = 14;
    description.fills = [{
      type: 'SOLID',
      color: { r: 0.5, g: 0.5, b: 0.5 }, // Серый текст
    }];
    header.appendChild(description);
    
    card.appendChild(header);
    
    // Content area
    const content = figma.createFrame();
    content.name = 'Content';
    content.fills = [];
    content.layoutMode = 'VERTICAL';
    content.layoutSizingHorizontal = 'FILL';
    content.layoutGrow = 1;
    
    const contentText = figma.createText();
    contentText.characters = 'Content area';
    contentText.fontSize = 14;
    contentText.fills = [{
      type: 'SOLID',
      color: COLORS.foreground,
    }];
    content.appendChild(contentText);
    
    card.appendChild(content);
    
    components.push(card);
  }
  
  // Combine into component set
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Card';
  componentSet.description = 'Container card with header and content';
  
  return componentSet;
}
