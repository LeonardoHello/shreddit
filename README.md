# Shreddit: A Reddit Clone Project

## Overview
Shreddit is a clone of Reddit with some modifications to the user experience. It's built using Next.js 13 app router including some of the latest technologies.

## Technologies Used
* **Next.js 13 App Router:** Leveraging the latest advancements in Next.js.
* **TypeScript:** Utilizing TypeScript to enforce type safety throughout the codebase.
* **tRPC:** Ensuring fully type-safe APIs for seamless communication between frontend and backend.
* **React Query (TanStack Query):** Employing React Query for efficient client-side data fetching.
* **Clerk:** Incorporating Clerk for user management and authentication.
* **Neon:** Utilizing Neon as a fully managed serverless Postgres solution.
* **Drizzle ORM:** Managing database schemas in TypeScript with Drizzle ORM.
* **Tailwind CSS:** yep.

### Features
* **Reddit Clone:** Shreddit mirrors the functionality of Reddit, allowing users to create posts, upvote/downvote, comment, and engage in discussions.
* **Type Safety:** TypeScript is extensively used throughout the project to enforce type safety, reducing bugs and improving code quality.
* **Secure Authentication:** Clerk provides robust user management and authentication, ensuring a secure environment for handling sensitive user data.
* **Optimized Data Fetching:** With the implementation of React Query's useInfiniteQuery, featuring gradual fetching for a responsive and efficient user experience handling of posts.
* **Optimistic Updates:** Incorporates optimistic updates to provide immediate feedback to users while ensuring data consistency.

# Usage
**To run Shreddit locally:**
1. Clone the repository: **`git clone https://github.com/LeonardoHello/shreddit.git`**
2. Install dependencies: **`npm install`**
3. Add env variables inside .env.local file: 
```
(neon) DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```
4. Run the development server: **`npm run dev`**
