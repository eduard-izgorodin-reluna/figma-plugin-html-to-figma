/**
 * DS → Figma Converter (CLEAN VERSION)
 * 
 * Main entry point for the conversion engine.
 * Only exports the Tailwind parser - no SmartGenerators or CVA parser.
 */

export { 
  TailwindToFigmaParser,
  parseTailwind,
  applyFrameProps,
  applyTextProps,
  hexToRgb,
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  SHADOWS,
} from './tailwind-parser';

export type {
  FigmaFrameProps,
  FigmaTextProps,
  FigmaFill,
  FigmaStroke,
  FigmaEffect,
  RGB,
  RGBA,
} from './tailwind-parser';
