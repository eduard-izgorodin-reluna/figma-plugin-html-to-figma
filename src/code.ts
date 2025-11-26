/**
 * DS to Figma Plugin - Main Code (CLEAN VERSION)
 * 
 * Минимальная рабочая версия плагина.
 * Использует только ручные генераторы из ./generators/
 */

import { 
  createButton,
  createInput,
  createBadge,
  createCard,
  createCheckbox,
  createSwitch,
  createAvatar,
  createLabel,
  createSeparator,
} from './generators';

// Type for generators
type GeneratorFn = () => Promise<ComponentSetNode | FrameNode> | ComponentSetNode | FrameNode;

// Registry of available generators (only 9 hand-crafted ones)
const generators: Record<string, GeneratorFn> = {
  'button': createButton,
  'input': createInput,
  'badge': createBadge,
  'card': createCard,
  'checkbox': createCheckbox,
  'switch': createSwitch,
  'avatar': createAvatar,
  'label': createLabel,
  'separator': createSeparator,
};

// Show UI
figma.showUI(__html__, { 
  width: 420, 
  height: 600,
  themeColors: true,
});

console.log('🚀 DS-to-Figma Plugin started (clean version)');
console.log('📦 Available generators:', Object.keys(generators).join(', '));

// Handle messages from UI
figma.ui.onmessage = async (msg: { type: string; components?: string[] }) => {
  if (msg.type === 'generate') {
    const selectedComponents = msg.components || [];
    
    // Load fonts
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    
    let generatedCount = 0;
    let yOffset = 0;
    const VERTICAL_GAP = 150; // Gap between components
    const total = selectedComponents.length;
    const generatedNodes: SceneNode[] = [];
    
    for (let i = 0; i < selectedComponents.length; i++) {
      const componentName = selectedComponents[i];
      
      // Send progress update
      figma.ui.postMessage({ 
        type: 'progress', 
        current: i + 1, 
        total: total 
      });
      
      try {
        const generator = generators[componentName];
        
        if (!generator) {
          figma.ui.postMessage({ 
            type: 'log', 
            message: `⏳ No generator for: ${componentName}` 
          });
          continue;
        }
        
        // Await the generator
        const componentSet = await Promise.resolve(generator());
        
        if (componentSet) {
          // Position the component set with proper offset
          componentSet.x = 100;
          componentSet.y = yOffset;
          
          // Calculate next position based on actual height (with fallback)
          const height = componentSet.height > 0 ? componentSet.height : 100;
          yOffset += height + VERTICAL_GAP;
          
          generatedCount++;
          generatedNodes.push(componentSet);
          
          figma.ui.postMessage({ 
            type: 'log', 
            message: `✅ ${componentName}: node-id=${componentSet.id}` 
          });
        }
      } catch (error) {
        figma.ui.postMessage({ 
          type: 'error', 
          message: `❌ ${componentName}: ${error}` 
        });
      }
    }
    
    // Zoom to fit generated components
    if (generatedNodes.length > 0) {
      figma.viewport.scrollAndZoomIntoView(generatedNodes);
    }
    
    figma.ui.postMessage({ 
      type: 'complete', 
      count: generatedCount 
    });
    
    figma.notify(`Generated ${generatedCount} components`);
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
