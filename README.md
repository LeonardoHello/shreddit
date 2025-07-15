# Shreddit - A Modern Social Media Platform

## Project Description

Shreddit is a full-stack social media platform inspired by Reddit, designed to provide users with a seamless experience in creating communities, sharing content, and engaging in discussions. The platform is built with cutting-edge web technologies, ensuring a responsive and interactive user interface.

## Technologies Used

- **Frontend:**  
  - Developed with **React 19** and **Next.js 15**, utilizing server-side rendering, dynamic routing, and client/server components for optimal performance and SEO.
  - Implemented responsive, accessible UIs using **Tailwind CSS** and **shadcn/ui** components, ensuring seamless experiences across devices.
  - Built advanced navigation features, including a collapsible, mobile-friendly sidebar and real-time search with instant feedback.
  - Integrated **TipTap** rich text editor for posts and comments, supporting image uploads and custom formatting.
  - Used **motion/react** for smooth UI animations and transitions.

- **Type Safety & Code Quality:**  
  - Enforced strict type safety with **TypeScript** and **Zod** schemas for runtime validation.
  - Maintained code quality with **ESLint** configurations and consistent formatting via **Prettier**.

- **State Management & Context:**  
  - Designed robust context providers for post submission, recent communities, and sidebar state, using React Context with useReducer and custom hooks.
  - Leveraged **React Query** for data fetching, caching, and optimistic UI updates, including infinite scrolling and skeleton loading states.

- **Backend & API Layer:**  
  - Architected a type-safe API using **tRPC**, enabling seamless client-server communication.
  - Modeled data with **Drizzle ORM**, writing complex SQL queries for feeds, user actions, and community management.
  - Implemented authentication and user management with **Better-Auth**, supporting OAuth providers (Google, GitHub, Discord) and secure session handling.

- **File Uploads & Media:**  
  - Integrated **UploadThing** for image uploads, including client-side dropzones and progress feedback.
  - Utilized **Thumbhash** for lightweight image placeholders, improving perceived performance.

- **UX & Error Handling:**  
  - Provided user-friendly error messages and recovery options.
  - Used **Sonner** for toast notifications and feedback.
  - Designed loading skeletons for all major flows.

- **Other Features:**  
  - Scheduled cron jobs for filesystem cleanup.
  - Implemented community moderation, favoriting, muting, and joining features.
  - Supported infinite feeds for posts, upvoted, saved, and hidden content.
  - Adhered to best practices for accessibility, performance, and maintainability.

# Usage

**To run Shreddit locally:**

1. Clone the repository: `git clone https://github.com/LeonardoHello/shreddit.git`
2. Install dependencies: `pnpm i`
3. Add environment variables inside the `.env.local` file:
   ```plaintext
   DATABASE_URL=
   UPLOADTHING_TOKEN=
   BETTER_AUTH_SECRET=
   BETTER_AUTH_URL=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   DISCORD_CLIENT_ID=
   DISCORD_CLIENT_SECRET=
   ```
4. Run drizzle schema migration: `pnpm push` [source](https://orm.drizzle.team/docs/migrations)
5. Run the development server: `pnpm dev`
