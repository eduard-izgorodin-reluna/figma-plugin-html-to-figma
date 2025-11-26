/**
 * Separator Component Generator
 * Based on DS: h-px w-full bg-border (horizontal) or h-full w-px (vertical)
 */

export function createSeparator(): ComponentSetNode {
  const components: ComponentNode[] = [];
  
  const orientations = ['horizontal', 'vertical'];
  
  for (const orientation of orientations) {
    const separator = figma.createComponent();
    separator.name = `orientation=${orientation}`;
    
    if (orientation === 'horizontal') {
      separator.resize(200, 1);  // h-px, flexible width
    } else {
      separator.resize(1, 100);  // w-px, flexible height
    }
    
    // bg-border - используем видимый серый цвет
    separator.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    
    components.push(separator);
  }
  
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = 'Separator';
  componentSet.description = 'Divider line - horizontal or vertical';
  
  return componentSet;
}
