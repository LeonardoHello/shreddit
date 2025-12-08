# Shreddit

**A modern, high-performance social media platform built with the latest web technologies.**

Shreddit is a full-stack application inspired by Reddit, engineered to demonstrate **end-to-end type safety**, **scalable architecture**, and **optimal user experience**. It leverages the power of Next.js 16 and React 19, backed by a robust Hono API and Drizzle ORM.

## 🚀 Key Features & Technical Highlights

### Core Architecture

- **Next.js 16 & React 19**: Utilizes the latest React Server Components (RSC) and Server Actions for a hybrid rendering strategy that maximizes performance and SEO.
- **Hono (+RPC)**: Implements a lightweight, edge-compatible API layer. The client-server communication is fully typed via Hono's RPC client, ensuring that API contract changes are instantly reflected in the frontend.
- **Drizzle ORM**: A modern TypeScript ORM that allows for type-safe SQL queries. The database schema is modularized and strictly typed, preventing runtime data errors.
- **Valibot**: Replaces Zod for schema validation to reduce bundle size. Valibot's tree-shakeable architecture ensures that only the validators used are included in the final build.

### Design Patterns & Code Quality

- **End-to-End Type Safety**: From the database schema (Drizzle) to the API validation (Valibot) and the client-side consumption (Hono Client), data flows through the application with strict type guarantees.
- **Modular Domain-Driven Structure**: The codebase is organized by domain (e.g., `routers/post.ts`, `schema/posts.ts`), making it easy to scale and maintain.
- **Optimistic UI Updates**: Leverages **React Query** to provide instant user feedback for actions like voting and commenting, synchronizing with the server in the background.

### UI/UX

- **Tailwind CSS v4**: Styled with the latest version of Tailwind for a utility-first, performant design system.
- **Shadcn/ui**: Implements accessible, reusable components based on Radix UI.
- **Rich Interaction**: Features a custom TipTap editor for rich text posts, drag-and-drop image uploads via UploadThing, and smooth animations with Motion (formerly Framer Motion).
- **Performance**: Images use **Thumbhash** for immediate, blur-up loading placeholders, significantly improving perceived performance.

## 🛠️ Tech Stack

| Category       | Technology                         |
| -------------- | ---------------------------------- |
| **Framework**  | Next.js 16 (App Router), React 19  |
| **Language**   | TypeScript                         |
| **API**        | Hono (RPC), React Query            |
| **Database**   | PostgreSQL (Neon), Drizzle ORM     |
| **Validation** | Valibot                            |
| **Styling**    | Tailwind CSS v4, shadcn/ui, Motion |
| **Auth**       | Better-Auth (OAuth + Sessions)     |
| **Media**      | UploadThing, Sharp, Thumbhash      |

## 📦 Usage

**To run Shreddit locally:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/LeonardoHello/shreddit.git
    cd shreddit
    ```

2.  **Install dependencies:**

    ```bash
    pnpm i
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    DATABASE_URL=postgresql://...
    UPLOADTHING_TOKEN=...
    BETTER_AUTH_SECRET=...
    BETTER_AUTH_URL=http://localhost:3000
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    GITHUB_CLIENT_ID=...
    GITHUB_CLIENT_SECRET=...
    DISCORD_CLIENT_ID=...
    DISCORD_CLIENT_SECRET=...
    ```

4.  **Database Migration:**
    Push the Drizzle schema to your database:

    ```bash
    pnpm push
    ```

5.  **Start Development Server:**
    ```bash
    pnpm dev
    ```
