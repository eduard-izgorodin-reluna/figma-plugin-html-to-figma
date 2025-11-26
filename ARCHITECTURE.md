# DS-to-Figma Plugin Architecture

## 🧹 ТЕКУЩЕЕ СОСТОЯНИЕ (ЧИСТОЕ)

```
ds-to-figma/
├── manifest.json          # Figma plugin manifest
├── package.json           # Dependencies (webpack, typescript, figma types)
├── webpack.config.js      # Build config
├── tsconfig.json          # TypeScript config
│
├── scripts/               # 🚫 ПУСТАЯ - скрипты удалены
│
├── src/
│   ├── code.ts            # ✅ ГЛАВНЫЙ ФАЙЛ (13.7 KiB после сборки)
│   ├── ui.html            # UI плагина (React/HTML)
│   │
│   ├── types/
│   │   └── component.ts   # TypeScript типы (FigmaStyles, ComponentVariant, etc.)
│   │
│   ├── converter/
│   │   ├── index.ts              # Экспорт парсера
│   │   ├── tailwind-parser.ts    # TailwindToFigmaParser (849 строк)
│   │   └── design-tokens.generated.ts  # ⚡ Авто-токены из CSS
│   │
│   ├── mapping/
│   │   └── tailwind-to-figma.ts  # Маппинг классов → Figma свойств
│   │
│   └── generators/        # 9 ручных генераторов
│       ├── index.ts
│       ├── button.ts      # ✅ Работает (оранжевый)
│       ├── input.ts       # ✅ Работает
│       ├── badge.ts
│       ├── card.ts
│       ├── checkbox.ts    # ✅ Работает
│       ├── switch.ts      # ✅ Работает
│       ├── avatar.ts
│       ├── label.ts
│       └── separator.ts
│
└── dist/
    ├── code.js            # Скомпилированный плагин
    └── ui.html
```

---

## 🔄 ПОТОК ДАННЫХ (КАК СЕЙЧАС)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FIGMA PLUGIN                             │
│                                                                  │
│  ┌──────────────┐                                                │
│  │   ui.html    │  ──── User selects ────►  Button, Checkbox    │
│  │  (React UI)  │        components                              │
│  └──────┬───────┘                                                │
│         │                                                        │
│         │ postMessage({type: 'generate', components: [...]})     │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │   code.ts    │  ◄──── Main entry point                       │
│  │  (Sandbox)   │                                                │
│  └──────┬───────┘                                                │
│         │                                                        │
│         │ generators['button']() → createButton()                │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              generators/button.ts                         │   │
│  │                                                           │   │
│  │  ┌─────────────────┐                                      │   │
│  │  │ buttonDefinition│  Жёстко закодированные стили:       │   │
│  │  │                 │  - fills: COLORS['primary']         │   │
│  │  │                 │  - paddingLeft: 16                  │   │
│  │  │                 │  - cornerRadius: 6                  │   │
│  │  └────────┬────────┘                                      │   │
│  │           │                                               │   │
│  │           │ import { COLORS } from '../mapping/...'       │   │
│  │           ▼                                               │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │         mapping/tailwind-to-figma.ts            │     │   │
│  │  │                                                 │     │   │
│  │  │  import { COLORS } from                         │     │   │
│  │  │    '../converter/design-tokens.generated'       │     │   │
│  │  └────────────────────┬────────────────────────────┘     │   │
│  │                       │                                   │   │
│  │                       ▼                                   │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │    converter/design-tokens.generated.ts         │     │   │
│  │  │                                                 │     │   │
│  │  │  COLORS = {                                     │     │   │
│  │  │    'primary': { r: 1.000, g: 0.494, b: 0.260 }  │     │   │
│  │  │    'background': { r: 1.000, g: 1.000, b: 1.000}│     │   │
│  │  │    ...                                          │     │   │
│  │  │  }                                              │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │ Figma Canvas │  ComponentSetNode с вариантами                │
│  │              │  (Button/variant=default,size=md)              │
│  └──────────────┘                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❌ ПРОБЛЕМЫ ТЕКУЩЕЙ АРХИТЕКТУРЫ

### 1. Жёстко закодированные стили в генераторах
```typescript
// generators/button.ts - ПЛОХО!
styles: {
  fills: [{ type: 'SOLID', color: COLORS['primary'], opacity: 1 }],
  paddingLeft: 16,  // ← Магические числа
  cornerRadius: 6,  // ← Не из DS
}
```

### 2. Нет связи с реальным DS кодом
```typescript
// DS: packages/ds/src/button.tsx
const buttonVariants = cva('px-4 py-2 rounded-md bg-primary ...')

// Plugin: generators/button.ts  
paddingLeft: 16,    // ← Вручную скопировано, устареет
cornerRadius: 6,    // ← Не синхронизировано
```

### 3. Tailwind Parser не используется в генераторах
```typescript
// converter/tailwind-parser.ts существует, но генераторы его НЕ ИСПОЛЬЗУЮТ!
// Вместо этого всё захардкожено в button.ts, input.ts и т.д.
```

---

## ✅ КАК ДОЛЖНО БЫТЬ (ЦЕЛЕВАЯ АРХИТЕКТУРА)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    SOURCE OF TRUTH: DS Package                            │
│                                                                           │
│  packages/ds/src/button.tsx                                               │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  const buttonVariants = cva(                                       │  │
│  │    'inline-flex items-center justify-center rounded-md text-sm',   │  │
│  │    {                                                               │  │
│  │      variants: {                                                   │  │
│  │        variant: {                                                  │  │
│  │          default: 'bg-primary text-primary-foreground',            │  │
│  │          destructive: 'bg-destructive text-destructive-foreground',│  │
│  │          outline: 'border border-input bg-background',             │  │
│  │        },                                                          │  │
│  │        size: {                                                     │  │
│  │          default: 'h-9 px-4 py-2',                                 │  │
│  │          sm: 'h-8 px-3 text-xs',                                   │  │
│  │          lg: 'h-10 px-8',                                          │  │
│  │        }                                                           │  │
│  │      }                                                             │  │
│  │    }                                                               │  │
│  │  )                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    │ ПАРСИНГ при сборке                   │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │        scripts/generate-components.mjs                             │  │
│  │                                                                    │  │
│  │  1. Читает packages/ds/src/*.tsx                                   │  │
│  │  2. Парсит CVA вызовы (регулярками или AST)                       │  │
│  │  3. Извлекает Tailwind классы для каждого варианта                │  │
│  │  4. Генерирует generators/*.generated.ts                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    ▼                                      │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    SOURCE OF TRUTH: Themes Package                        │
│                                                                           │
│  packages/themes/src/base.css + family.css                                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  :root {                                                           │  │
│  │    --color-primary: oklch(0.684 0.171 36.8);    → #FF7E42          │  │
│  │    --color-background: oklch(1 0 0);            → #FFFFFF          │  │
│  │    --radius-md: 0.375rem;                       → 6px              │  │
│  │    --spacing-4: 1rem;                           → 16px             │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    │ ПАРСИНГ при сборке                   │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │        scripts/extract-tokens.mjs                                  │  │
│  │                                                                    │  │
│  │  1. Читает CSS файлы темы                                          │  │
│  │  2. Парсит CSS переменные (:root { --color-*: ... })              │  │
│  │  3. Конвертирует oklch → RGB                                       │  │
│  │  4. Генерирует converter/design-tokens.generated.ts                │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    ▼                                      │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         FIGMA PLUGIN (Runtime)                            │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │         generators/button.generated.ts                             │  │
│  │                                                                    │  │
│  │  // AUTO-GENERATED from packages/ds/src/button.tsx                 │  │
│  │  export function createButton(): ComponentSetNode {                │  │
│  │    const variants = [                                              │  │
│  │      {                                                             │  │
│  │        name: 'variant=default, size=default',                      │  │
│  │        tailwindClasses: 'bg-primary text-primary-foreground h-9 px-4 py-2 rounded-md',                                                       │  │
│  │      },                                                            │  │
│  │      ...                                                           │  │
│  │    ];                                                              │  │
│  │                                                                    │  │
│  │    // Используем TailwindToFigmaParser для конвертации             │  │
│  │    for (const v of variants) {                                     │  │
│  │      const figmaProps = parseTailwind(v.tailwindClasses);          │  │
│  │      applyFrameProps(frame, figmaProps);                           │  │
│  │    }                                                               │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                    │                                      │
│                                    │ parseTailwind('bg-primary h-9 px-4') │
│                                    ▼                                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │        converter/tailwind-parser.ts                                │  │
│  │                                                                    │  │
│  │  parseTailwind('bg-primary h-9 px-4 rounded-md')                   │  │
│  │                                    │                               │  │
│  │  → {                               │                               │  │
│  │      fills: [COLORS['primary']],   │ import from design-tokens     │  │
│  │      height: 36,                   │                               │  │
│  │      paddingLeft: 16,              ▼                               │  │
│  │      cornerRadius: 6,     ←── design-tokens.generated.ts           │  │
│  │    }                                                               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 ПЛАН ДЕЙСТВИЙ

### Этап 1: Улучшить парсинг токенов ✅ (уже сделано)
- [x] `scripts/extract-tokens.mjs` - извлекает токены из CSS
- [x] `design-tokens.generated.ts` - авто-генерируемые цвета

### Этап 2: Создать парсер DS компонентов 🚧
- [ ] `scripts/parse-ds-components.mjs` - парсит CVA из `packages/ds/src/*.tsx`
- [ ] Извлекает Tailwind классы для каждого варианта
- [ ] Возвращает структуру: `{ component, baseClasses, variants: { variant: { value: classes } } }`

### Этап 3: Создать генератор Figma компонентов
- [ ] `scripts/generate-figma-components.mjs` 
- [ ] Использует результат парсера + TailwindToFigmaParser
- [ ] Генерирует `generators/*.generated.ts`

### Этап 4: Тестирование
- [ ] Проверить Button, Card, Input в Figma
- [ ] Сравнить с реальным DS Storybook
- [ ] Автотесты (опционально)

---

## 🎯 КЛЮЧЕВЫЕ ПРИНЦИПЫ

1. **Single Source of Truth** = DS код (`packages/ds/src/*.tsx`)
2. **Авто-генерация** при каждом изменении DS
3. **Парсер Tailwind** уже есть, нужно только его использовать
4. **Никаких магических чисел** - всё из токенов
5. **Синхронизация** DS ↔ Figma через CI/CD

---

## 📁 ИСТОЧНИКИ ДАННЫХ

| Данные | Источник | Скрипт | Результат |
|--------|----------|--------|-----------|
| Цвета | `packages/themes/src/*.css` | `extract-tokens.mjs` | `design-tokens.generated.ts` |
| Spacing | `packages/themes/src/*.css` | `extract-tokens.mjs` | `design-tokens.generated.ts` |
| Radius | `packages/themes/src/*.css` | `extract-tokens.mjs` | `design-tokens.generated.ts` |
| Компоненты | `packages/ds/src/*.tsx` | `parse-ds-components.mjs` | `component-specs.generated.ts` |
| Figma | `component-specs.generated.ts` | `generate-figma.mjs` | `generators/*.generated.ts` |
