# Frontend Project Context

## 1. Project Overview

- **Project name**: Realtime Chat
- **Project type**: Web Application
- **Purpose**: Ứng dụng chat thời gian thực cho phép người dùng nhắn tin, quản lý cuộc hội thoại
- **Target users**: Người dùng cần giao tiếp trực tuyến qua tin nhắn
- **Supported devices**: Desktop, Tablet, Mobile

## 2. Tech Stack

- **Framework**: Next.js 15.5.2 (App Router với Turbopack)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 + tw-animate-css
- **State management**: Redux Toolkit + Redux Saga
- **Data fetching**: Axios
- **Form handling**: React Hook Form + Yup validation
- **Authentication**: JWT (accessToken / refreshToken)
- **UI Library**: shadcn/ui version 3.6.1 (Radix UI primitives)
- **Theme**: next-themes (hỗ trợ dark mode)

## 3. Architecture & Structure

- **Architecture pattern**: Feature-based (Feature-Sliced Design)
- **Folder structure**:

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes (login, register)
│   ├── (main)/             # Main app routes (conversations, messages)
│   ├── globals.css         # Global styles & CSS variables
│   ├── layout.tsx          # Root layout
│   └── providers.tsx       # Context providers (Redux, Theme)
├── components/             # Shared components
│   └── ui/                 # shadcn/ui components
├── constants/              # API endpoints, constants
├── features/               # Feature modules
│   ├── auth/               # Authentication (slice, saga, service, types, schema)
│   ├── conversations/      # Conversation management
│   ├── messages/           # Message handling
│   └── user/               # User-related types
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & configurations
│   ├── axios.ts            # Axios client configuration
│   └── utils.ts            # Helper functions (cn)
├── services/               # (Reserved for services)
├── store/                  # Redux store configuration
│   ├── index.ts            # Store setup
│   └── rootSaga.ts         # Combined sagas
└── types/                  # Shared TypeScript types
```

## 4. Rules

### Coding Standards

- Sử dụng TypeScript strict mode
- Prettier cho code formatting
- ESLint với config Next.js
- Path alias: `@/*` → `./src/*`

### Component Rules

- Mỗi component exported dưới dạng named export
- Props interface đặt tên theo format: `I[ComponentName]Props`
- Sử dụng `cn()` utility cho class merging

### State Management Rules

- Mỗi feature có slice riêng (`feature.slice.ts`)
- Side effects xử lý qua Redux Saga (`feature.saga.ts`)
- API calls đặt trong service (`feature.service.ts`)
- Types định nghĩa trong `feature.types.ts`
- Form schema định nghĩa trong `feature.schema.ts` (Yup)

### File Naming Convention

- Component: PascalCase (`AuthGuard.tsx`)
- Feature files: kebab-case (`auth.slice.ts`, `auth.saga.ts`)
- Types/Interfaces: Prefix `I` cho interfaces (`IUser`, `IAuthResponse`)

## 5. UI/UX Requirements

- **UI style**: Clean, Modern, Minimal
- **Primary color**: oklch-based theming (xem CSS variables)
- **Secondary color**: `#6B7280` (gray-500)
- **Accent color**: `#CD7F32` (bronze)
- **Responsive**: Mobile-first approach
- **Dark mode**: Hỗ trợ đầy đủ via `next-themes`
- **Loading state**: Bắt buộc cho mọi API call, có thể sử dụng Skeleton loading cho UI
- **Error handling**: Hiển thị lỗi thân thiện cho người dùng
- **Toast notifications**: Sử dụng `sonner` library

## 6. Authentication Flow

- Login/Register với email/password
- JWT tokens (accessToken + refreshToken)
- Token storage: (cần xác định - localStorage/cookies)
- Protected routes qua `AuthGuard` component
- API endpoint: `/auth/login`, `/auth/register`, `/auth/me`

## 7. API Configuration

- Base URL: Defined in `.env`
- HTTP Client: Axios with centralized configuration
- Error handling: Centralized trong axios interceptors

## 8. Form & Validation

- Tất cả form phải có validation với Yup schema
- Validate ở client trước khi submit
- Error message rõ ràng, ngắn gọn (Vietnamese)
- Disable submit button khi đang loading
- Form integration qua `@hookform/resolvers`

## 9. Dependencies Overview

### Core

- `next`: 15.5.2

### State & Data

- `@reduxjs/toolkit`: State management
- `redux-saga`: Side effects
- `react-redux`: React bindings
- `axios`: HTTP client

### Forms

- `react-hook-form`: Form handling
- `@hookform/resolvers`: Resolver adapters
- `yup`: Schema validation

### UI Components (Radix)

- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-popover`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-tabs`
- `@radix-ui/react-tooltip`
- `lucide-react`: Icons
- `cmdk`: Command menu

### Utilities

- `class-variance-authority`: Component variants
- `clsx` + `tailwind-merge`: Class utilities
- `sonner`: Toast notifications
- `input-otp`: OTP input component
