/**
 * Storybook Component Capture Script
 * 
 * This script opens Storybook components in Puppeteer and captures
 * their DOM structure using @builder.io/html-to-figma library.
 * 
 * Usage:
 *   npx tsx scripts/capture-storybook.ts --url http://localhost:6006 --story button--primary
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// The htmlToFigma function needs to be injected into the page
// We'll use the browser build from the library

interface CaptureOptions {
  storybookUrl: string;
  storyId: string;
  outputDir: string;
  selector?: string;
}

interface FigmaLayer {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: any[];
  strokes?: any[];
  children?: FigmaLayer[];
  [key: string]: any;
}

interface CaptureResult {
  layers: FigmaLayer[];
  storyId: string;
  capturedAt: string;
}

async function captureComponent(options: CaptureOptions): Promise<CaptureResult> {
  const { storybookUrl, storyId, selector = '#storybook-root' } = options;
  
  console.log(`🚀 Launching browser...`);
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Construct iframe URL for Storybook
    // Storybook renders stories in an iframe at /iframe.html?id=<storyId>
    const storyUrl = `${storybookUrl}/iframe.html?id=${storyId}&viewMode=story`;
    
    console.log(`📖 Opening story: ${storyUrl}`);
    await page.goto(storyUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for the component to render - Storybook needs time
    console.log(`⏳ Waiting for component to render...`);
    await page.waitForSelector(selector, { timeout: 10000 });
    
    // Wait for actual content inside the root
    await page.waitForFunction(
      (sel: string) => {
        const root = document.querySelector(sel);
        return root && root.children.length > 0;
      },
      { timeout: 10000 },
      selector
    );
    
    // Give it more time for styles to apply and any animations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Debug: take a screenshot
    await page.screenshot({ path: 'captured/debug-screenshot.png' });
    console.log(`📸 Screenshot saved to captured/debug-screenshot.png`);
    
    // Debug: log what we see
    const debugInfo = await page.evaluate(`
      (function() {
        var root = document.querySelector('#storybook-root');
        return {
          rootExists: !!root,
          rootChildCount: root ? root.children.length : 0,
          rootHTML: root ? root.innerHTML.substring(0, 500) : 'no root',
          bodyChildCount: document.body.children.length
        };
      })()
    `);
    console.log(`🔍 Debug info:`, debugInfo);

    console.log(`🔍 Capturing DOM structure...`);    // Inject the html-to-figma capture script
    // We use addScriptTag to avoid tsx bundling issues
    const layers = await page.evaluate(`
      (function(sel) {
        // Mini implementation of DOM to Figma conversion
        // Based on the approach from @builder.io/html-to-figma
        
        function rgbToFigma(color) {
          // Handle rgb/rgba
          var rgbaMatch = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
          if (rgbaMatch) {
            return {
              r: parseInt(rgbaMatch[1]) / 255,
              g: parseInt(rgbaMatch[2]) / 255,
              b: parseInt(rgbaMatch[3]) / 255,
              a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
            };
          }
          
          // Handle hex
          var hexMatch = color.match(/^#([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i);
          if (hexMatch) {
            return {
              r: parseInt(hexMatch[1], 16) / 255,
              g: parseInt(hexMatch[2], 16) / 255,
              b: parseInt(hexMatch[3], 16) / 255,
              a: 1
            };
          }
          
          return null;
        }
        
        function getBorderRadius(style) {
          var radius = parseFloat(style.borderRadius);
          return isNaN(radius) ? 0 : radius;
        }
        
        function elementToFigma(element, parentRect) {
          var rect = element.getBoundingClientRect();
          var style = window.getComputedStyle(element);
          
          // Skip invisible elements
          if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) {
            return null;
          }
          
          var x = parentRect ? rect.left - parentRect.left : rect.left;
          var y = parentRect ? rect.top - parentRect.top : rect.top;
          
          var node = {
            type: 'RECTANGLE',
            x: x,
            y: y,
            width: rect.width,
            height: rect.height,
            name: element.tagName.toLowerCase() + (element.className ? '.' + element.className.toString().split(' ')[0] : ''),
          };
          
          // Background color
          var bgColor = rgbToFigma(style.backgroundColor);
          if (bgColor && bgColor.a > 0) {
            node.fills = [{
              type: 'SOLID',
              color: { r: bgColor.r, g: bgColor.g, b: bgColor.b },
              opacity: bgColor.a
            }];
          } else {
            node.fills = [];
          }
          
          // Border
          var borderWidth = parseFloat(style.borderWidth);
          if (borderWidth > 0) {
            var borderColor = rgbToFigma(style.borderColor);
            if (borderColor) {
              node.strokes = [{
                type: 'SOLID',
                color: { r: borderColor.r, g: borderColor.g, b: borderColor.b },
                opacity: borderColor.a
              }];
              node.strokeWeight = borderWidth;
            }
          }
          
          // Border radius
          var cornerRadius = getBorderRadius(style);
          if (cornerRadius > 0) {
            node.cornerRadius = cornerRadius;
          }
          
          // Process children
          var children = [];
          for (var i = 0; i < element.children.length; i++) {
            var childNode = elementToFigma(element.children[i], rect);
            if (childNode) {
              children.push(childNode);
            }
          }
          
          // Check for direct text content
          var directText = '';
          for (var j = 0; j < element.childNodes.length; j++) {
            if (element.childNodes[j].nodeType === Node.TEXT_NODE) {
              var txt = element.childNodes[j].textContent || '';
              if (txt.trim()) {
                directText += txt;
              }
            }
          }
          directText = directText.trim();
          
          // Check if element has visual styling that requires a FRAME
          var bgColor = rgbToFigma(style.backgroundColor);
          var hasBgColor = bgColor && bgColor.a > 0;
          var hasBorder = parseFloat(style.borderWidth) > 0;
          var hasRadius = cornerRadius > 0;
          var hasVisualStyles = hasBgColor || hasBorder || hasRadius;
          
          // Element with ONLY text AND no visual styles becomes pure TEXT node
          if (element.children.length === 0 && directText && !hasVisualStyles) {
            node.type = 'TEXT';
            node.characters = directText;
            node.fontSize = parseFloat(style.fontSize);
            node.fontFamily = style.fontFamily.split(',')[0].replace(/['\"]/g, '').trim();
            node.fontWeight = parseInt(style.fontWeight) || 400;
            
            var textColor = rgbToFigma(style.color);
            if (textColor) {
              node.fills = [{
                type: 'SOLID',
                color: { r: textColor.r, g: textColor.g, b: textColor.b },
                opacity: textColor.a
              }];
            }
            return node;
          }
          
          // Element with text AND visual styles becomes FRAME with TEXT child
          if (element.children.length === 0 && directText && hasVisualStyles) {
            var textColor = rgbToFigma(style.color);
            children.push({
              type: 'TEXT',
              x: 0,
              y: 0,
              width: rect.width,
              height: rect.height,
              name: 'text-content',
              characters: directText,
              fontSize: parseFloat(style.fontSize),
              fontFamily: style.fontFamily.split(',')[0].replace(/['\"]/g, '').trim(),
              fontWeight: parseInt(style.fontWeight) || 400,
              fills: textColor ? [{
                type: 'SOLID',
                color: { r: textColor.r, g: textColor.g, b: textColor.b },
                opacity: textColor.a
              }] : []
            });
          }
          
          // Element with children becomes FRAME
          // (text was already added above if hasVisualStyles)
          if (children.length > 0) {
            node.type = 'FRAME';
            node.children = children;
            
            // Detect auto-layout from flexbox
            if (style.display === 'flex' || style.display === 'inline-flex') {
              node.layoutMode = style.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
              node.primaryAxisAlignItems = style.justifyContent === 'center' ? 'CENTER' : 
                                            style.justifyContent === 'flex-end' ? 'MAX' : 'MIN';
              node.counterAxisAlignItems = style.alignItems === 'center' ? 'CENTER' : 
                                            style.alignItems === 'flex-end' ? 'MAX' : 'MIN';
              
              var gap = parseFloat(style.gap);
              if (!isNaN(gap)) {
                node.itemSpacing = gap;
              }
            }
            
            // Padding
            var paddingTop = parseFloat(style.paddingTop);
            var paddingRight = parseFloat(style.paddingRight);
            var paddingBottom = parseFloat(style.paddingBottom);
            var paddingLeft = parseFloat(style.paddingLeft);
            
            if (paddingTop > 0 || paddingRight > 0 || paddingBottom > 0 || paddingLeft > 0) {
              node.paddingTop = paddingTop || 0;
              node.paddingRight = paddingRight || 0;
              node.paddingBottom = paddingBottom || 0;
              node.paddingLeft = paddingLeft || 0;
            }
          }
          
          return node;
        }
        
        var root = document.querySelector(sel);
        if (!root) {
          return null;
        }
        
        // Find the actual component (first child of root)
        var component = root.firstElementChild;
        if (!component) {
          return null;
        }
        
        return elementToFigma(component);
      })('${selector}')
    `);
    
    console.log(`✅ Capture complete!`);
    
    return {
      layers: layers ? [layers] : [],
      storyId,
      capturedAt: new Date().toISOString()
    };
    
  } finally {
    await browser.close();
  }
}

async function captureMultipleStories(
  storybookUrl: string, 
  storyIds: string[], 
  outputDir: string
): Promise<void> {
  console.log(`\n📦 Capturing ${storyIds.length} stories from ${storybookUrl}\n`);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const results: CaptureResult[] = [];
  
  for (const storyId of storyIds) {
    try {
      console.log(`\n--- Capturing: ${storyId} ---`);
      const result = await captureComponent({
        storybookUrl,
        storyId,
        outputDir
      });
      results.push(result);
      
      // Save individual story JSON
      const filename = `${storyId.replace(/--/g, '-').replace(/\//g, '-')}.figma.json`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
      console.log(`💾 Saved: ${filepath}`);
      
    } catch (error) {
      console.error(`❌ Failed to capture ${storyId}:`, error);
    }
  }
  
  // Save combined JSON
  const combinedPath = path.join(outputDir, 'all-components.figma.json');
  fs.writeFileSync(combinedPath, JSON.stringify({ 
    components: results,
    generatedAt: new Date().toISOString()
  }, null, 2));
  
  console.log(`\n✨ All captures complete! Combined file: ${combinedPath}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name: string, defaultValue: string = ''): string => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const storybookUrl = getArg('url', 'http://localhost:6006');
const storyId = getArg('story', '');
const outputDir = getArg('output', './captured');

if (storyId) {
  // Single story capture
  captureComponent({
    storybookUrl,
    storyId,
    outputDir
  }).then(result => {
    const filename = `${storyId.replace(/--/g, '-')}.figma.json`;
    const filepath = path.join(outputDir, filename);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    console.log(`\n💾 Saved: ${filepath}`);
    console.log(`\n📋 Preview:\n`, JSON.stringify(result.layers[0], null, 2).substring(0, 500) + '...');
  }).catch(console.error);
} else {
  console.log(`
📸 Storybook Component Capture

Usage:
  npx tsx scripts/capture-storybook.ts --url <storybook-url> --story <story-id>

Examples:
  # Capture a single story
  npx tsx scripts/capture-storybook.ts --url http://localhost:6006 --story button--primary
  
  # With custom output directory
  npx tsx scripts/capture-storybook.ts --url http://localhost:6006 --story button--primary --output ./figma-captures

Options:
  --url     Storybook URL (default: http://localhost:6006)
  --story   Story ID (e.g., button--primary, components-input--default)
  --output  Output directory (default: ./captured)
`);
}

export { captureComponent, captureMultipleStories };
