<div align="center">
  <a href="https://github.com/notDMG/japanese-cuisine">
    <img src="https://img.shields.io/badge/🍱-Japanese%20Cuisine-red?style=for-the-badge" alt="Logo" />
  </a>

  <h1>Japanese Cuisine</h1>

  <p>
    Платформа для создания рецептов японской кухни и расчёта их стоимости
    <br />
    <br />
    <a href="https://github.com/notDMG/japanese-cuisine/issues/new?labels=bug">Сообщить об ошибке</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/notDMG/japanese-cuisine/issues/new?labels=enhancement">Предложить идею</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

<details>
  <summary><b>Содержание</b></summary>

- [About The Project](#about-the-project)
- [Screenshots](#screenshots)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [License](#license)
- [Contacts](#contacts)

</details>

---

## About The Project

**Japanese Cuisine** - пет-проект, в котором пользователи ведут собственный список ингредиентов с ценами и собирают из них рецепты японской кухни. Стоимость блюда считается автоматически.

> Проект создан для практики с Next.js App Router, Prisma ORM и аутентификацией через NextAuth v5.

### Features

- **Публичная лента** - последние рецепты всех пользователей: автор, состав, стоимость каждого ингредиента и итоговая цена блюда
- **Доступ по ролям** - автор открывает рецепт в режиме редактирования, остальные пользователи - в режиме просмотра
- **Конструктор рецептов** - динамический список до 10 ингредиентов, уже выбранные ингредиенты блокируются в выпадающем списке, превью изображения по URL с обработкой ошибки загрузки
- **Каталог ингредиентов** - 6 категорий, 5 единиц измерения и цена за единицу; ингредиент, который используется в рецептах, нельзя удалить - приложение покажет, в каких именно
- **Расчёт стоимости** - цена каждой позиции и сумма блюда; ингредиенты без цены не ломают расчёт, а помечаются отдельно
- **Вход и регистрация в модальных окнах** - без перехода на отдельные страницы; закрытые разделы показывают гостю приглашение войти
- **Адаптивный интерфейс** - мобильное меню, таблица ингредиентов превращается в карточки, skeleton-загрузчики, собственная страница 404

### Technical Solutions

**Аутентификация и безопасность**

- **Auth.js v5**: Credentials-провайдер + Prisma Adapter, JWT-сессии со сроком жизни 1 час, `id` пользователя прокидывается в сессию через колбэки `jwt` / `session`
- Пароли хэшируются **bcrypt** с солью; при неудачном входе возвращается одинаковый ответ, чтобы по нему нельзя было узнать, зарегистрирован ли email
- **Авторизация на сервере, а не только в UI**: каждый Server Action проверяет сессию и владельца записи перед изменением или удалением
- **Изоляция данных**: ингредиенты и личные рецепты запрашиваются только с фильтром по `authorId`
- HTML-контент очищается через **DOMPurify** перед рендером - защита от XSS

**База данных**

- Нормализованная схема: связь «многие ко многим» между рецептами и ингредиентами через промежуточную таблицу с количеством, enum-ы для категорий и единиц, индексы по `authorId`
- **Prisma 7** с драйвер-адаптером `@prisma/adapter-pg`, версионируемые миграции
- Singleton Prisma Client через `globalThis` - без утечки подключений при hot reload
- Состав рецепта обновляется одним вложенным запросом (`deleteMany` + `create` с `connect`)
- Целостность данных: удаление ингредиента, используемого в рецептах, блокируется на сервере

**Формы и валидация**

- **React Hook Form** + `zodResolver`, динамические поля через `useFieldArray`
- **Двойная валидация**: те же Zod-схемы повторно проверяют данные в Server Actions - клиенту не доверяем

**Архитектура фронтенда**

- **Server Components** для страниц с данными - лента и страница рецепта получают данные из БД прямо на сервере, без отдельного API
- **Server Actions** как слой API с типизированным результатом `{ success } | { error }` - ошибки обрабатываются без исключений
- **Zustand**-сторы с состояниями загрузки и ошибок; HOC `AppLoader` синхронизирует их с сессией: загружает данные после входа и очищает после выхода, чтобы данные не переходили между аккаунтами
- **React Compiler** - автоматическая мемоизация без ручных `useMemo` / `useCallback`
- Toast-уведомления **Sonner** для всех асинхронных действий

**Качество кода**

- **TypeScript** в strict-режиме, типы моделей генерируются из схемы Prisma
- **ESLint** (`eslint-config-next`) и **Prettier** с автосортировкой Tailwind-классов
- Pre-commit проверки через **Husky** + **lint-staged**
- История коммитов в формате **Conventional Commits** (`feat`, `fix`, `style`, `refactor`)

---

## Screenshots

### Главная страница

![Главная страница](docs/home-page.png)

_Лента рецептов всех пользователей со стоимостью блюд_

### Основные экраны

|                    Просмотр рецепта                     |                Мои рецепты                 |
| :-----------------------------------------------------: | :----------------------------------------: |
|        ![Просмотр рецепта](docs/recipe-view.png)        |    ![Мои рецепты](docs/my-recipes.png)     |
| _Состав, цена каждого ингредиента и итоговая стоимость_ | _Редактирование и удаление своих рецептов_ |
|                     **Ингредиенты**                     |              **Регистрация**               |
|        ![Ингредиенты](docs/ingredient-form.png)         |    ![Регистрация](docs/auth-modal.png)     |
| _Добавление ингредиента с категорией, единицей и ценой_ |    _Модальное окно входа и регистрации_    |

### Мобильная версия

|                  Меню                   |                       Ингредиенты                        |
| :-------------------------------------: | :------------------------------------------------------: |
| ![Мобильное меню](docs/mobile-menu.png) | ![Ингредиенты на мобильном](docs/mobile-ingredients.png) |
|  _Навигация на мобильных устройствах_   |            _Таблица превращается в карточки_             |

---

## Built With

| Слой           | Технология                                                                     |
| -------------- | ------------------------------------------------------------------------------ |
| Фреймворк      | [Next.js 16](https://nextjs.org/) (App Router)                                 |
| UI             | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/)   |
| База данных    | [PostgreSQL](https://www.postgresql.org/) + [Prisma 7](https://www.prisma.io/) |
| Аутентификация | [NextAuth v5 (Auth.js)](https://authjs.dev/)                                   |
| Формы          | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)      |
| Состояние      | [Zustand](https://zustand-demo.pmnd.rs/)                                       |
| Уведомления    | [Sonner](https://sonner.emilkowal.ski/)                                        |
| Качество кода  | ESLint + Prettier + Husky + lint-staged                                        |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20.9+
- [PostgreSQL](https://www.postgresql.org/) - локально или в Docker

### Installation

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/notDMG/japanese-cuisine.git
   cd japanese-cuisine
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Создайте файл `.env` на основе `.env.example`:

   ```bash
   cp .env.example .env
   ```

   и заполните переменные:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/japanese_cuisine?schema=public"

   # NextAuth
   AUTH_SECRET="your-secret-key"
   ```

   > `AUTH_SECRET` можно сгенерировать командой `npx auth secret`.

4. Примените миграции базы данных:

   ```bash
   npx prisma migrate dev
   ```

5. Запустите проект в режиме разработки:

   ```bash
   npm run dev
   ```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
japanese-cuisine/
├── docs/                     # Скриншоты для README
├── prisma/
│   ├── migrations/           # Миграции БД
│   └── schema.prisma         # Схема БД (User, Recipe, Ingredient)
├── src/
│   ├── actions/              # Server Actions (рецепты, ингредиенты)
│   ├── app/
│   │   ├── (home)/           # Главная страница - лента рецептов
│   │   ├── recipes/          # Мои рецепты, создание, просмотр и редактирование
│   │   ├── ingredients/      # Ингредиенты
│   │   └── about/            # О проекте
│   ├── auth/                 # Конфигурация NextAuth
│   ├── components/
│   │   ├── UI/               # Компоненты интерфейса
│   │   └── forms/            # Формы (вход, регистрация, рецепты, ингредиенты)
│   ├── constants/            # Константы (категории, единицы измерения)
│   ├── generated/prisma/     # Сгенерированный Prisma Client
│   ├── hoc/                  # Higher-Order Components
│   ├── schema/               # Zod-схемы валидации
│   ├── store/                # Zustand-сторы
│   ├── types/                # TypeScript-типы
│   └── utils/                # Утилиты (Prisma client, расчёт стоимости)
├── .env.example
└── package.json
```

---

## Scripts

```bash
npm run dev           # Запуск в режиме разработки
npm run build         # Production-сборка
npm run start         # Запуск production-сборки
npm run lint          # Проверка ESLint
npm run format        # Форматирование Prettier
npm run format:check  # Проверка форматирования
```

---

## Roadmap

- [x] Адаптивный интерфейс
- [x] Регистрация и аутентификация
- [x] CRUD рецептов
- [x] CRUD ингредиентов
- [x] Расчёт стоимости рецептов
- [ ] Поиск и фильтрация рецептов
- [ ] Избранные рецепты
- [ ] Загрузка изображений в облачное хранилище
- [ ] Публичные профили пользователей

---

## License

Проект распространяется под лицензией [Unlicense](LICENSE.txt): код можно свободно копировать, изменять и использовать в любых целях, включая коммерческие.

---

## Contacts

**notDMG**

[![Telegram](https://img.shields.io/badge/Telegram-@dmglIl-2CA5E0?logo=telegram&logoColor=white)](https://t.me/dmglIl)
[![Gmail](https://img.shields.io/badge/Gmail-dimagerasimov300@gmail.com-D14836?logo=gmail&logoColor=white)](mailto:dimagerasimov300@gmail.com)

Репозиторий: [github.com/notDMG/japanese-cuisine](https://github.com/notDMG/japanese-cuisine)
