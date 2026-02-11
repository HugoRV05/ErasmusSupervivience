# Erasmus Survival PWA — System Architecture

This document explains the architecture, state management, and design principles of the Erasmus Survival PWA for future AI agents or developers continuing the work.

## Core Principles

- **Mobile-First & iOS Aesthetic**: Designed primarily for iPhone Home Screen usage. Uses safe-area paddings, large tap targets, and iOS-style navigation.
- **Full Customizability**: No features are strictly hardcoded. Users can manage their own expense categories, shopping lists, pantry items, and schedule colors.
- **Offline Reliability**: PWA with a service worker (`public/sw.js`) and manifest to ensure it works as a standalone app even without a connection.
- **Local-Only Data**: No backend. All state is stored in the browser's `localStorage` for privacy and instant responsiveness.

## Tech Stack

- **Next.js 15 (App Router)**: Core framework.
- **Tailwind CSS 4**: Modern styling with iOS-inspired tokens.
- **Shadcn UI**: Radix-based primitives for accessible UI components.
- **React Context API**: Global state management.
- **LocalStorage**: Persistence via a custom `useLocalStorage` hook.
- **Framer Motion**: Smooth page transitions and micro-animations.
- **Recharts**: Lightweight data visualization.

## State Management (`src/context/AppContext.tsx`)

The app uses a single global `AppContext` that provides:

- **Expenses**: CRUD functions for tracking money spent.
- **Pantry**: Inventory management with quantity controls and low-stock logic.
- **Shopping Lists**: Multiple custom lists with item management.
- **Schedule**: Weekly class timeline and appointments.
- **Reminders**: Specific Erasmus-related tasks with completion status.
- **Data Portability**: Logic for JSON export/import and full data reset.

All state slices are persisted automatically to `localStorage` using keys prefixed with `erasmus-`.

## Key Files & Directories

- `src/types/`: Centralized TypeScript interfaces for all data models.
- `src/hooks/useLocalStorage.ts`: Generic hook for sync-to-disk state.
- `src/components/layout/`: Shared layout shells (BottomNav, PageShell).
- `src/lib/constants.ts`: Seed data used only on the very first launch.
- `src/lib/utils.ts`: Shared logic for currency, dates, IDs, and stock levels.

## Adding Features

To add a new feature:

1. Define the type in `src/types/index.ts`.
2. Add the state and CRUD handlers to `src/context/AppContext.tsx`.
3. Create the UI page in `src/app/[feature]/page.tsx`.
4. Register the new route in `src/components/layout/BottomNav.tsx`.
