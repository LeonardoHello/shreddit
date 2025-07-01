# Shreddit - A Modern Social Media Platform

## Project Description

Shreddit is a full-stack social media platform inspired by Reddit, designed to provide users with a seamless experience in creating communities, sharing content, and engaging in discussions. The platform is built with cutting-edge web technologies, ensuring a responsive and interactive user interface.

## Technologies Used

1. **Next.js (v15)**: A React framework for server-side rendering, routing, and API routes.
2. **React (v19)**: A JavaScript library for building user interfaces.
3. **TypeScript**: Enhances JavaScript with static typing for improved code quality.
4. **Tailwind CSS**: A utility-first CSS framework for styling.
5. **shadcn/ui**: Provides beautifully designed, accessible, and customizable components.
6. **tRPC**: A type-safe API layer for client-server communication.
7. **Drizzle ORM**: A type-safe SQL query builder and ORM.
8. **UploadThing**: A file upload service for handling image uploads.
9. **TipTap**: A rich text editor implementation.
10. **Better-Auth**: Manages authentication and user management.

## Features

- **Reddit Clone Functionality**: Shreddit mirrors Reddit's core features, allowing users to create posts, upvote/downvote, comment, and engage in discussions.
- **Type Safety**: Extensive use of TypeScript throughout the project ensures type safety, reducing bugs and enhancing code quality.
- **Secure Authentication**: Better-Auth provides robust user management and authentication, ensuring a secure environment for handling sensitive user data.
- **Optimized Data Fetching**: Utilizes React Query's `useInfiniteQuery` for infinite scrolling, providing a smooth user experience when browsing posts.
- **Optimistic Updates**: Incorporates optimistic updates to provide immediate feedback to users, enhancing the user experience by reducing perceived latency.
- **Thumbhash for Image Handling**: Uses the Thumbhash library to generate lightweight image placeholders, improving page load times and user experience.
- **Cron Job for Filesystem Management**: Implements a scheduled cron job to manage and clean up unused files, ensuring efficient use of storage resources.
- **Responsive Design**: The platform is designed to be fully responsive, adapting to various screen sizes and devices.
- **Real-time Search**: Implements a real-time search feature, allowing users to quickly find content and communities.
- **Advanced Sidebar Navigation**: Features a collapsible and mobile-friendly sidebar for easy navigation.
- **Error Handling**: Provides user-friendly error messages and recovery options in case of server issues.
- **Adherence to Best Practices**: Leverages ESLint configurations from React Query, React Compiler, and Drizzle, ensuring consistent code quality.

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
   RESEND_API_KEY=
   ```
4. Run drizzle schema migration: `pnpm push` [source](https://orm.drizzle.team/docs/migrations)
5. Run the development server: `pnpm dev`
