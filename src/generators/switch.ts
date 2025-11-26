/**
 * Switch Component Generator
 * Based on DS: h-[1.15rem] w-8 rounded-full with thumb
 */

import { COLORS } from '../mapping/tailwind-to-figma';

export function createSwitch(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const states = [
    { checked: false, disabled: false },
    { checked: true, disabled: false },
    { checked: false, disabled: true },
    { checked: true, disabled: true },
  ];
  
  for (const state of states) {
    const switchComp = figma.createComponent();
    switchComp.name = `checked=${state.checked}, disabled=${state.disabled}`;
    
    // h-[1.15rem] ≈ 18px, w-8 = 32px
    switchComp.resize(32, 18);
    
    // Layout
    switchComp.layoutMode = 'HORIZONTAL';
    switchComp.primaryAxisAlignItems = state.checked ? 'MAX' : 'MIN';
    switchComp.counterAxisAlignItems = 'CENTER';
    switchComp.paddingLeft = 2;
    switchComp.paddingRight = 2;
    
    // rounded-full
    switchComp.cornerRadius = 9999;
    
    // Track color based on state - используем видимые цвета
    if (state.checked) {
      switchComp.fills = [{ type: 'SOLID', color: COLORS.primary }]; // Оранжевый
    } else {
      switchComp.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }]; // Серый
    }
    
    if (state.disabled) {
      switchComp.opacity = 0.5;
    }
    
    // Thumb - size-4 = 16px, but slightly smaller to fit
    const thumb = figma.createEllipse();
    thumb.name = 'thumb';
    thumb.resize(14, 14);
    thumb.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // Белый thumb
    
    // Добавим тень для thumb
    thumb.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.15 },
      offset: { x: 0, y: 1 },
      radius: 2,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    }];
    
    switchComp.appendChild(thumb);
    components.push(switchComp);
  }
  
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Switch';
  componentSet.description = 'Toggle switch - h-[1.15rem] w-8 rounded-full';
  
  return componentSet;
}
