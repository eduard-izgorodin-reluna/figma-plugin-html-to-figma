/**
 * DS to Figma Plugin - Main Code
 * 
 * Supports both:
 * 1. Hand-crafted generators
 * 2. JSON import from captured Storybook components
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

// Registry of available generators
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

// Types for JSON import
interface FigmaNodeJSON {
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'ELLIPSE' | 'VECTOR';
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fills?: Array<{
    type: 'SOLID';
    color: { r: number; g: number; b: number };
    opacity?: number;
  }>;
  strokes?: Array<{
    type: 'SOLID';
    color: { r: number; g: number; b: number };
    opacity?: number;
  }>;
  strokeWeight?: number;
  cornerRadius?: number;
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  children?: FigmaNodeJSON[];
  // Text specific
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
}

// Create Figma node from JSON
async function createNodeFromJSON(json: FigmaNodeJSON, parent?: FrameNode): Promise<SceneNode | null> {
  try {
    let node: SceneNode;

    if (json.type === 'TEXT') {
      const textNode = figma.createText();
      
      // Load font
      const fontFamily = json.fontFamily || 'Inter';
      const fontWeight = json.fontWeight || 400;
      const fontStyle = fontWeight >= 600 ? 'Bold' : fontWeight >= 500 ? 'Medium' : 'Regular';
      
      try {
        await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
      } catch {
        // Fallback to Inter
        await figma.loadFontAsync({ family: 'Inter', style: fontStyle });
      }
      
      textNode.characters = json.characters || '';
      textNode.fontSize = json.fontSize || 14;
      
      if (json.fills && json.fills.length > 0) {
        textNode.fills = json.fills.map(fill => ({
          type: 'SOLID' as const,
          color: { r: fill.color.r, g: fill.color.g, b: fill.color.b },
          opacity: fill.opacity ?? 1
        }));
      }
      
      node = textNode;
    } else if (json.type === 'RECTANGLE') {
      const rectNode = figma.createRectangle();
      if (json.cornerRadius) rectNode.cornerRadius = json.cornerRadius;
      if (json.fills && json.fills.length > 0) {
        rectNode.fills = json.fills.map(fill => ({
          type: 'SOLID' as const,
          color: { r: fill.color.r, g: fill.color.g, b: fill.color.b },
          opacity: fill.opacity ?? 1
        }));
      }
      node = rectNode;
    } else if (json.type === 'ELLIPSE') {
      const ellipseNode = figma.createEllipse();
      node = ellipseNode;
    } else {
      // FRAME or default
      const frameNode = figma.createFrame();
      
      // Layout
      if (json.layoutMode && json.layoutMode !== 'NONE') {
        frameNode.layoutMode = json.layoutMode;
        frameNode.primaryAxisSizingMode = 'AUTO';
        frameNode.counterAxisSizingMode = 'AUTO';
        
        if (json.primaryAxisAlignItems) {
          frameNode.primaryAxisAlignItems = json.primaryAxisAlignItems;
        }
        if (json.counterAxisAlignItems) {
          frameNode.counterAxisAlignItems = json.counterAxisAlignItems;
        }
        if (json.itemSpacing !== undefined) {
          frameNode.itemSpacing = json.itemSpacing;
        }
      }
      
      // Padding
      if (json.paddingTop !== undefined) frameNode.paddingTop = json.paddingTop;
      if (json.paddingRight !== undefined) frameNode.paddingRight = json.paddingRight;
      if (json.paddingBottom !== undefined) frameNode.paddingBottom = json.paddingBottom;
      if (json.paddingLeft !== undefined) frameNode.paddingLeft = json.paddingLeft;
      
      // Corner radius
      if (json.cornerRadius !== undefined) {
        frameNode.cornerRadius = json.cornerRadius;
      }
      
      // Fills
      if (json.fills && json.fills.length > 0) {
        frameNode.fills = json.fills.map(fill => ({
          type: 'SOLID' as const,
          color: { r: fill.color.r, g: fill.color.g, b: fill.color.b },
          opacity: fill.opacity ?? 1
        }));
      } else {
        frameNode.fills = [];
      }
      
      // Strokes
      if (json.strokes && json.strokes.length > 0) {
        frameNode.strokes = json.strokes.map(stroke => ({
          type: 'SOLID' as const,
          color: { r: stroke.color.r, g: stroke.color.g, b: stroke.color.b },
          opacity: stroke.opacity ?? 1
        }));
        frameNode.strokeWeight = json.strokeWeight || 1;
      }
      
      // Process children
      if (json.children && json.children.length > 0) {
        for (const childJSON of json.children) {
          const childNode = await createNodeFromJSON(childJSON, frameNode);
          if (childNode) {
            frameNode.appendChild(childNode);
          }
        }
      }
      
      node = frameNode;
    }

    // Common properties
    node.name = json.name || json.type;
    
    // Position (only for non-auto-layout children)
    if (!parent || parent.layoutMode === 'NONE') {
      if (json.x !== undefined) node.x = json.x;
      if (json.y !== undefined) node.y = json.y;
    }
    
    // Size (for non-text nodes without auto-layout)
    if (json.type !== 'TEXT' && json.width && json.height) {
      if ('resize' in node) {
        const frameNode = node as FrameNode;
        if (!frameNode.layoutMode || frameNode.layoutMode === 'NONE') {
          node.resize(json.width, json.height);
        }
      }
    }

    return node;
  } catch (error) {
    console.error('Error creating node:', error);
    return null;
  }
}

// Show UI
figma.showUI(__html__, { 
  width: 420, 
  height: 550,
  themeColors: true,
});

console.log('🚀 DS-to-Figma Plugin started');
console.log('📦 Available generators:', Object.keys(generators).join(', '));

// Handle messages from UI
figma.ui.onmessage = async (msg: { 
  type: string; 
  components?: string[];
  layers?: FigmaNodeJSON[];
  fileCount?: number;
}) => {
  // Import JSON
  if (msg.type === 'import-json') {
    const layers = msg.layers || [];
    
    figma.ui.postMessage({ 
      type: 'log', 
      message: `📥 Processing ${layers.length} layers...` 
    });

    // Load default fonts
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

    let createdCount = 0;
    let yOffset = 0;
    const createdNodes: SceneNode[] = [];

    for (const layerJSON of layers) {
      try {
        const node = await createNodeFromJSON(layerJSON);
        
        if (node) {
          node.x = 100;
          node.y = yOffset;
          
          figma.currentPage.appendChild(node);
          createdNodes.push(node);
          createdCount++;
          
          yOffset += node.height + 50;
          
          figma.ui.postMessage({ 
            type: 'success', 
            message: `✅ Created: ${node.name}` 
          });
        }
      } catch (error) {
        figma.ui.postMessage({ 
          type: 'error', 
          message: `❌ Error: ${error}` 
        });
      }
    }

    if (createdNodes.length > 0) {
      figma.viewport.scrollAndZoomIntoView(createdNodes);
    }

    figma.ui.postMessage({ 
      type: 'complete', 
      count: createdCount 
    });

    figma.notify(`✅ Imported ${createdCount} components`);
    return;
  }

  // Generate with hand-crafted generators
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
