# DS to Figma - Quick Start Guide

## 🚀 Как запустить плагин в Figma

### Шаг 1: Открой Figma Desktop

> ⚠️ Плагин работает только в **Figma Desktop App** (не в браузере)

### Шаг 2: Загрузи плагин

1. Открой любой файл в Figma
2. Кликни правой кнопкой → **Plugins** → **Development** → **Import plugin from manifest...**
3. Выбери файл:
   ```
   /Users/eduardizgorodin/reluna/work-workspace/projects/figma-plugin-html-to-figma/manifest.json
   ```

### Шаг 3: Запусти плагин

- Правая кнопка → **Plugins** → **Development** → **Reluna DS Generator**

---

## 📥 Как импортировать компоненты из Storybook

### Шаг 1: Запусти Storybook (если ещё не запущен)

```bash
cd /Users/eduardizgorodin/reluna/work-workspace/projects/FG/turbo/apps/storybook
pnpm storybook -p 6006 --no-open
```

### Шаг 2: Захвати компонент

```bash
cd /Users/eduardizgorodin/reluna/work-workspace/projects/figma-plugin-html-to-figma

# Один компонент
npx tsx scripts/capture-storybook.ts --story components-button--default

# Посмотреть список всех story IDs
curl -s http://localhost:6006/index.json | jq '.entries | keys[]' | head -20
```

### Шаг 3: Импортируй в Figma

1. Открой плагин в Figma
2. Перетащи JSON файл из папки `captured/` в окно плагина
3. Нажми **Import to Figma**

---

## 📁 Структура проекта

```
figma-plugin-html-to-figma/
├── manifest.json         # Конфиг плагина для Figma
├── dist/                 # Собранный плагин
│   ├── code.js          # Логика плагина
│   └── ui.html          # UI плагина
├── src/
│   ├── code.ts          # Исходник логики
│   ├── ui-import.html   # UI для импорта
│   └── generators/      # Ручные генераторы
├── scripts/
│   └── capture-storybook.ts  # Скрипт захвата
└── captured/            # Захваченные JSON файлы
```

---

## 🎯 Доступные компоненты для захвата

```
components-button--default
components-button--accent
components-alert--default
components-alert--destructive
components-badge--default
components-card--default
components-checkbox--default
components-switch--default
components-input--default
```

---

## 🔧 Полезные команды

```bash
# Пересобрать плагин после изменений
npm run build

# Запустить в watch режиме
npm run watch

# Захватить все компоненты (batch)
npx tsx scripts/capture-all-ds.ts
```

---

## ⚡ Быстрый тест

```bash
# 1. Убедись что Storybook работает
curl -s http://localhost:6006 | head -5

# 2. Захвати Button
cd /Users/eduardizgorodin/reluna/work-workspace/projects/figma-plugin-html-to-figma
npx tsx scripts/capture-storybook.ts --story components-button--default

# 3. Проверь результат
cat captured/components-button-default.figma.json | jq '.layers[0].children[0]'
```

---

## 🎨 Что импортируется

| CSS Property | Figma Property |
|-------------|----------------|
| `background-color` | `fills` |
| `border` | `strokes` + `strokeWeight` |
| `border-radius` | `cornerRadius` |
| `display: flex` | `layoutMode` |
| `gap` | `itemSpacing` |
| `padding` | `paddingTop/Right/Bottom/Left` |
| `color` | Text `fills` |
| `font-size` | `fontSize` |
| `font-family` | `fontFamily` |
| `font-weight` | `fontWeight` |

---

## 🐛 Troubleshooting

**Плагин не загружается?**
- Проверь что используешь Figma Desktop (не браузер)
- Пересобери: `npm run build`

**Storybook не отвечает?**
- Проверь порт: `lsof -i :6006`
- Перезапусти: `pnpm storybook -p 6006`

**JSON не импортируется?**
- Проверь формат: должен быть `{ "layers": [...] }`
- Проверь консоль Figma: View → Show Console
