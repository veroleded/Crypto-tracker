# 🚀 Crypto Tracker

Современное веб-приложение для отслеживания криптовалют, построенное на стеке Next.js, TypeScript и Supabase.

## 📋 Возможности

- 📊 Отслеживание топ-100 криптовалют в реальном времени
- ⭐ Добавление криптовалют в избранное
- 💰 Калькулятор прибыли для расчета инвестиций
- 📱 Адаптивный дизайн для всех устройств
- 🔒 Безопасная аутентификация через Supabase

## 🛠 Технологический стек

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui
  - React Query + tRPC

- **Backend:**
  - Supabase (База данных и аутентификация)
  - CoinGecko API (Данные о криптовалютах)

- **Инфраструктура:**
  - Turborepo (Монорепозиторий)
  - pnpm (Пакетный менеджер)

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 22.10.0 или выше
- pnpm 9.15.4 или выше
- Аккаунт Supabase

### Установка

1. Клонируйте репозиторий:
\`\`\`bash
git clone [URL репозитория]
cd [название проекта]
\`\`\`

2. Установите зависимости:
\`\`\`bash
pnpm install
\`\`\`

3. Создайте файл .env на основе .env.example:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Заполните переменные окружения в .env:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your-database-url
\`\`\`

5. Запустите проект в режиме разработки:
\`\`\`bash
pnpm dev
\`\`\`

### Структура проекта

\`\`\`
.
├── apps/
│   └── nextjs/          # Основное Next.js приложение
├── packages/
│   ├── api/            # tRPC API и роутеры
│   ├── db/            # Схема базы данных и миграции
│   ├── ui/            # UI компоненты
│   └── validators/    # Схемы валидации
└── package.json
\`\`\`

## 📝 Основные команды

- \`pnpm dev\` - Запуск проекта в режиме разработки
- \`pnpm build\` - Сборка проекта
- \`pnpm lint\` - Проверка кода линтером
- \`pnpm format\` - Форматирование кода
- \`pnpm typecheck\` - Проверка типов TypeScript


