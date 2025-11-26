# DS to Figma Plugin

Figma plugin that generates Figma components from `@reluna-fg/ds` Design System code.

## Features

### Smart Generators (NEW!)
The plugin now includes an intelligent conversion engine that:

1. **Tailwind Parser** - Converts Tailwind CSS classes to Figma properties
   - Full color mapping (brand, status, neutrals)
   - Spacing system (0-96 scale, 4px base)
   - Border radius (sm→4, md→6, lg→8, full→9999)
   - Typography (font sizes, weights, line heights)
   - Shadows (Figma DropShadowEffect arrays)

2. **CVA Parser** - Understands CVA (Class Variance Authority) configurations
   - Pre-configured for 20+ DS components
   - Generates all variant combinations automatically
   - Respects default variants

3. **Smart Component Generators** - 14 components with accurate Figma output:
   - **Button** - 48 variants (8 variant styles × 6 sizes)
   - **Badge** - 4 variants (default, secondary, destructive, outline)
   - **Input** - Multiple states (default, focus, error, disabled)
   - **Card** - With header, content, footer sections
   - **Avatar** - Multiple sizes
   - **Switch** - On/off states
   - **Checkbox** - Checked/unchecked/disabled states
   - **Alert** - 4 severity levels
   - **Toast** - All DS variants
   - **Dialog** - With overlay, header, content, footer
   - **Tabs** - Tab list with trigger states
   - **Select** - Trigger and option items
   - **Separator** - Horizontal line
   - **Label** - Text label component

## Design Token Mappings

### Colors
```typescript
primary: #FB6428
destructive: #CC0505  
success: #1CA693
warning: #EAA000
secondary: #F5F5F5
accent: (same as primary)
```

### Spacing (Tailwind → pixels)
```
0→0, 0.5→2, 1→4, 2→8, 3→12, 4→16, 5→20, 6→24, 8→32, 10→40, 12→48...
```

### Border Radius
```
rounded-none→0, rounded-sm→4, rounded→6, rounded-md→6, rounded-lg→8, rounded-xl→12, rounded-full→9999
```

### Typography
```
text-xs: 12px/16px
text-sm: 14px/20px  
text-base: 16px/24px
text-lg: 18px/28px
text-xl: 20px/28px
text-2xl: 24px/32px
```

## Development

### Prerequisites
- Node.js 18+
- pnpm

### Setup
```bash
cd turbo/packages/ds-to-figma
pnpm install
```

### Build
```bash
pnpm build      # Production build
pnpm build:dev  # Development watch mode
```

### Testing in Figma
1. Open Figma Desktop
2. Go to Plugins → Development → Import plugin from manifest...
3. Select `manifest.json` from this directory
4. Run plugin from Plugins menu

## Architecture

```
src/
├── code.ts              # Plugin entry point
├── ui.html              # Plugin UI
├── auto-gen/            # Auto-generated component parsers
│   ├── ds-parser.ts     # CVA extraction from DS source
│   └── auto-generators.ts
└── converter/           # Intelligent conversion engine
    ├── tailwind-parser.ts   # Tailwind → Figma props
    ├── cva-parser.ts        # CVA config parser + presets
    ├── smart-generators.ts  # 14 smart generators
    └── index.ts             # Exports
```

## Component Generation Priority

1. **Smart Generators** (preferred) - Hand-crafted with accurate styling
2. **Auto Generators** (fallback) - Parsed from DS source code

## Adding New Components

### Option 1: Add to Smart Generators
Edit `converter/smart-generators.ts`:

```typescript
async generateNewComponent(): Promise<FrameNode> {
  await loadFonts();
  
  const config = DS_COMPONENT_CONFIGS['new-component'];
  const container = createVariantContainer('NewComponent');
  
  // Create variants based on config
  for (const variant of config.variants) {
    const props = TailwindToFigmaParser.parse(variant.classes);
    // Create Figma nodes with props
  }
  
  return container;
}
```

### Option 2: Add to CVA Presets
Edit `converter/cva-parser.ts` and add to `DS_COMPONENT_CONFIGS`:

```typescript
'new-component': {
  base: 'base-classes-here',
  variants: {
    variant: {
      default: 'variant-default-classes',
      primary: 'variant-primary-classes',
    },
    size: {
      sm: 'size-sm-classes',
      lg: 'size-lg-classes',
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm'
  }
}
```

## Contributing

1. Keep smart generators in sync with `@reluna-fg/ds` changes
2. Test in Figma before committing
3. Update CVA presets when DS components change
4. Follow the existing patterns for new generators
