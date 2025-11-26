/**
 * Avatar Component Generator
 * Based on DS: rounded-full with image/fallback
 */

import { COLORS, FONT_SIZE } from '../mapping/tailwind-to-figma';

export function createAvatar(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const sizes = {
    sm: 32,
    default: 40,
    lg: 56,
    xl: 80,
  };
  
  const types = ['image', 'fallback'];
  
  for (const [sizeName, size] of Object.entries(sizes)) {
    for (const type of types) {
      const avatar = figma.createComponent();
      avatar.name = `size=${sizeName}, type=${type}`;
      
      avatar.resize(size, size);
      
      // Layout
      avatar.layoutMode = 'HORIZONTAL';
      avatar.primaryAxisAlignItems = 'CENTER';
      avatar.counterAxisAlignItems = 'CENTER';
      
      // rounded-full
      avatar.cornerRadius = size / 2;
      
      // Background - серый для fallback, светло-серый для image placeholder
      avatar.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
      
      if (type === 'fallback') {
        // Initials text
        const initials = figma.createText();
        initials.name = 'initials';
        initials.characters = 'AB';
        initials.fontSize = size <= 32 ? FONT_SIZE.xs.size : size <= 40 ? FONT_SIZE.sm.size : FONT_SIZE.base.size;
        initials.fontName = { family: 'Inter', style: 'Medium' };
        initials.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }]; // Серый текст
        initials.textAlignHorizontal = 'CENTER';
        
        avatar.appendChild(initials);
      } else {
        // Image placeholder (показываем иконку или цвет)
        avatar.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }]; // Чуть темнее для image
      }
      
      components.push(avatar);
    }
  }
  
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Avatar';
  componentSet.description = 'Avatar with image or initials fallback';
  
  return componentSet;
}
