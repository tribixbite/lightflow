# RepoZen

**GitHub Project Discovery & Organization Tool**

Live at: [repozen.com](https://repozen.com)

---

## What is RepoZen?

RepoZen is a GitHub project discovery app and organizational tool designed to help developers find, track, and manage repositories that match their tech stack preferences.

## Current Features

### GitHub Stack Search Helper
Build powerful GitHub search queries with an intuitive UI:

- **Ecosystem Toggle** - Switch between JavaScript/TypeScript and Python ecosystems
- **Global Filters** - Filter by minimum stars, minimum commits, and recency (updated within last week/month/year)
- **Tech Stack Selection** - Choose from 13 categories including:
  - Runtime, Linter, Bundler, ORM, Backend, Frontend
  - UI Library, Auth, Validation, State Management
  - Testing, Deployment, Database
- **Quick Search** - Fuzzy search across all stack options
- **URL Builder** - Generates GitHub search URLs with your selections
- **One-Click Actions** - Copy URL or open directly in GitHub

## Roadmap

- **GitHub OAuth Login** - Authenticate with your GitHub account
- **Star Sync** - Import and organize your starred repositories
- **Collections** - Create custom collections to organize projects
- **NPM Health Check** - View package health metrics, download stats, and maintenance scores
- **Dependency Analysis** - Analyze and compare project dependencies
- **Stack Profiles** - Save your preferred tech stack configurations
- **Repository Notes** - Add personal notes and tags to repositories
- **Export/Import** - Export your collections and settings

## Architecture

RepoZen is built as a monorepo scaffolding designed to host multiple apps. Each app can be as simple as a single TSX file.

### Tech Stack

- **Build**: [Vite](https://vitejs.dev/) - Fast development and optimized builds
- **Linting/Formatting**: [Biome](https://biomejs.dev/) - Rust-based formatter and linter (replaces ESLint + Prettier)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) - Utility-first CSS with pre-built components
- **Language**: TypeScript + React

### Project Structure

```
src/
├── components/     # React components (each can be a standalone app)
│   ├── ui/         # shadcn/ui components
│   └── GithubParam.tsx  # Main Stack Search Helper
├── lib/            # Utilities
└── main.tsx        # Entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run format` - Format code with Biome
- `npm run lint` - Lint code with Biome

### Configuration

- `biome.json` - Biome config with git integration and Tailwind class sorting
- `tailwind.config.js` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration

## Development

1. Clone the repository:
   ```sh
   git clone https://github.com/tribixbite/lightflow.git
   cd lightflow
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start development server:
   ```sh
   npm run dev
   ```

## Docker Instructions

### Building the Docker Image

To build the Docker image, run the following command in the root directory of the project:

```sh
docker build -t repozen .
```

### Running the Docker Container

To run the Docker container, use the following command:

```sh
docker run -p 3000:3000 repozen
```

### Using Docker Compose

Alternatively, you can use Docker Compose to build and run the project. Run the following command:

```sh
docker-compose up --build
```

This will start the application and map port 3000 on your host to port 3000 in the container.
