# 🚀 Crypto Tracker

Современное веб-приложение для отслеживания криптовалют, построенное на стеке Next.js, TypeScript и Supabase.

## 🌐 Демо

Проект развернут на Vercel и доступен по ссылке: [Crypto Tracker](https://test-infra-money.vercel.app)

## 📋 Возможности

- 📊 Отслеживание топ-100 криптовалют в реальном времени
- ⭐ Добавление криптовалют в избранное
- 💰 Калькулятор прибыли для расчета инвестиций
- 📱 Адаптивный дизайн для всех устройств
- 🔒 Безопасная аутентификация через Supabase
- ⚡ Оптимизированные запросы с кэшированием через Upstash Redis

## 🛠 Технологический стек

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui
  - React Query + tRPC

- **Backend:**
  - Supabase (База данных и аутентификация)
  - CoinGecko API Pro (Данные о криптовалютах)
  - Upstash Redis (Кэширование и управление лимитами запросов)

- **Инфраструктура:**
  - Vercel (Хостинг и развертывание)
  - Turborepo (Монорепозиторий)
  - pnpm (Пакетный менеджер)

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 22.10.0 или выше
- pnpm 9.15.4 или выше
- Аккаунт Supabase
- Аккаунт Upstash
- API ключ CoinGecko

### Установка

1. Клонируйте репозиторий:
```bash
git clone [URL репозитория]
cd [название проекта]
```

2. Установите зависимости:
```bash
pnpm install
```

3. Создайте файл .env на основе .env.example:
```bash
cp .env.example .env
```

4. Заполните переменные окружения в .env:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=your-database-url
UPSTASH_REDIS_URL=your-upstash-redis-url
UPSTASH_REDIS_TOKEN=your-upstash-redis-token
COINGECKO_API_KEY=your-coingecko-api-key
```

5. Запустите проект в режиме разработки:
```bash
pnpm dev
```

### Структура проекта

```
.
├── apps/
│   └── nextjs/          # Основное Next.js приложение
├── packages/
│   ├── api/            # tRPC API и роутеры
│   ├── db/            # Схема базы данных, Redis клиент и миграции
│   ├── ui/            # UI компоненты
│   └── validators/    # Схемы валидации
└── package.json
```

## 📝 Основные команды

- `pnpm dev` - Запуск проекта в режиме разработки
- `pnpm build` - Сборка проекта
- `pnpm lint` - Проверка кода линтером
- `pnpm format` - Форматирование кода
- `pnpm typecheck` - Проверка типов TypeScript

## 🌐 Развертывание

Проект оптимизирован для развертывания на Vercel:

1. Подключите ваш репозиторий к Vercel
2. Настройте переменные окружения в панели управления Vercel:
   - Все переменные из `.env`
   - Убедитесь, что добавили переменные Upstash Redis
3. Vercel автоматически определит конфигурацию Next.js и развернет приложение

## 🔧 Кэширование и оптимизация

Проект использует Upstash Redis для:
- Кэширования данных CoinGecko API
- Управления лимитами запросов (rate limiting)
- Оптимизации производительности

### Настройка Upstash Redis:

1. Создайте базу данных в [Upstash Console](https://console.upstash.com/)
2. Получите URL и токен для подключения
3. Добавьте их в переменные окружения:
   ```
   UPSTASH_REDIS_URL=your-redis-url
   UPSTASH_REDIS_TOKEN=your-token
   ```

### Особенности реализации:
- Кэширование данных на 60 секунд
- Автоматическое управление лимитами API (30 запросов в минуту)
- Fallback на кэшированные данные при превышении лимитов
- Оптимизированная пагинация с локальным кэшированием

