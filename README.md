[README_PROMPTFORGE.md](https://github.com/user-attachments/files/33307162/README_PROMPTFORGE.md)
<div align="center">

# PROMPTFORGE

### One lazy sentence in. One production-ready website build spec out.

Turn a simple website idea into a detailed, structured specification for designers and developers—or AI coding tools.

<p>
  <a href="#features">Features</a> ·
  <a href="#getting-started">Get Started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#api-reference">API Reference</a> ·
  <a href="#security">Security</a>
</p>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql)

</div>

---

## Overview

**PromptForge** is a full-stack Next.js application that transforms short website ideas into detailed, developer-oriented build specifications (“mega prompts”). The generated specification can guide an AI website builder, an AI coding assistant, or a human development team.

The project uses a **deterministic, heuristic-based enhancement engine** rather than external AI model calls. It classifies a brief against industry profiles and assembles a structured specification covering branding, design tokens, page layouts, components, interactions, SEO, accessibility, and backend considerations.

> [!NOTE]
> The engine is deterministic and template-driven. It does not call an external LLM to generate the specification.

## Features

- **Prompt enhancement:** Converts a short brief into a structured website build specification.
- **Industry detection:** Uses keyword-based scoring to select from the project's industry profiles.
- **Brand and design direction:** Produces brand details, color palettes, typography, and design tokens.
- **Page and component planning:** Outlines pages, reusable components, and expected interactions.
- **SEO and accessibility guidance:** Includes these considerations in the generated specification.
- **Copy and download:** Lets users reuse the generated specification.
- **Saved specification library:** Persists generated records in PostgreSQL.
- **Permanent spec pages:** Provides a route for viewing an individual saved specification.
- **Example prompts:** Includes curated example briefs to help users get started.
- **Health endpoint:** Exposes a database-backed health check.

## Screenshots

Screenshots were not included with the supplied README content. Add real screenshots here when available.

Create the folder `docs/assets/screenshots/` and save screenshots with these names:

| Screenshot | Suggested route | Filename |
|---|---|---|
| Home page | `/` | `home-hero.png` |
| Prompt forge | `/forge` | `forge-progress.png` |
| Generated specification | `/spec/1` | `spec-renderer.png` |
| Saved library | `/library` | `library.png` |

Once those files exist, you can display them in the README with:

```html
<div align="center">
  <img src="docs/assets/screenshots/home-hero.png" alt="PromptForge home page" width="900">
  <p><em>PromptForge home page</em></p>
  <img src="docs/assets/screenshots/spec-renderer.png" alt="Generated website build specification" width="900">
  <p><em>A generated website build specification</em></p>
</div>
```

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js App Router | Application framework and server-side routes |
| React | User interface |
| TypeScript | Type-safe application code |
| Tailwind CSS | Styling and design tokens |
| Framer Motion | UI animation |
| Lucide React | Icons |
| PostgreSQL | Persistent storage |
| Drizzle ORM | Database access and schema management |
| ESLint | Linting |

## Architecture

```mermaid
flowchart TD
    User["User enters website brief"] --> UI["PromptForge interface"]
    UI --> API["POST /api/enhance"]
    API --> Validate["Validate input"]
    Validate --> Engine["Deterministic enhancement engine"]
    Engine --> Profiles["Industry profiles"]
    Engine --> Spec["Compile structured build specification"]
    Spec --> DB["Drizzle ORM"]
    DB --> PG[("PostgreSQL")]
    Spec --> Result["Display, copy, download, or view saved spec"]
```

### Request flow

1. The user enters a short website brief.
2. The application validates the input.
3. The engine detects a likely industry and generates a specification.
4. The specification is stored in PostgreSQL.
5. The application returns the result and makes the saved record available through its spec route.

## Project Structure

The following is a high-level overview based on the project structure described in the supplied documentation. Confirm it against your current checkout if files have changed.

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── enhance/
│   │   │   ├── prompts/
│   │   │   ├── templates/
│   │   │   └── health/
│   │   ├── forge/
│   │   ├── library/
│   │   └── spec/
│   ├── components/
│   ├── db/
│   └── lib/
│       └── engine/
├── package.json
├── drizzle.config.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js **20.9 or newer**
- npm
- PostgreSQL **14 or newer**
- Git

### 1. Clone the repository

Replace the URL below with the actual URL of your GitHub repository.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Create a PostgreSQL database and update the connection string to match your local setup.

Create a `.env` file in the project root:

```dotenv
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME
```

Use your own database username, password, host, port, and database name. Do not commit real credentials.

### 4. Apply the database schema

The supplied project documentation describes using Drizzle Kit to synchronize the schema:

```bash
npx drizzle-kit push
```

Only use `--force` if you understand the potential impact on existing database data and have a backup.

> **Configuration note:** The supplied documentation says `drizzle.config.json` contains a database URL directly and does not interpolate environment variables. Check that file before running the command and ensure it targets the intended database. Do not point a development command at production unintentionally.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Check the application

If PostgreSQL is running and configured correctly, check the health endpoint:

```bash
curl http://localhost:3000/api/health
```

The expected healthy response described in the project notes is:

```json
{"ok":true}
```

You can then open `/forge` to try a prompt.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by the application |

Example only:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

Never commit real passwords, tokens, private URLs, or `.env` files.

## Application Routes

| Route | Method / Type | Purpose |
|---|---|---|
| `/` | Page | Project landing page |
| `/forge` | Page | Prompt enhancement interface |
| `/library` | Page | Saved specification library |
| `/spec/[id]` | Page | Individual saved specification |
| `/api/enhance` | `POST` | Validate a brief, generate a spec, and save it |
| `/api/prompts` | `GET` | List saved specifications |
| `/api/prompts/[id]` | `GET`, `DELETE` | Retrieve or delete a saved specification |
| `/api/templates` | `GET` | Return example briefs |
| `/api/health` | `GET` | Check database connectivity |

## API Reference

### `POST /api/enhance`

Generate a specification from a short brief.

**Request**

```bash
curl -X POST http://localhost:3000/api/enhance \
  -H "Content-Type: application/json" \
  -d '{"prompt":"make a website for a gym"}'
```

The supplied documentation describes a prompt length limit of 3–400 characters after trimming. Confirm the exact response schema in `src/app/api/enhance/route.ts` if you change the implementation.

### `GET /api/prompts`

Returns saved specification records. The supplied documentation says the `limit` query parameter defaults to 24 and is capped at 50.

```bash
curl "http://localhost:3000/api/prompts?limit=10"
```

### `GET /api/prompts/:id`

Returns a saved specification by ID.

```bash
curl http://localhost:3000/api/prompts/1
```

### `DELETE /api/prompts/:id`

Deletes a saved specification by ID.

> [!WARNING]
> The supplied project notes indicate this endpoint has no authentication. Do not expose it publicly until authorization and appropriate abuse protections are implemented.

### `GET /api/templates`

Returns the curated example prompts.

```bash
curl http://localhost:3000/api/templates
```

### `GET /api/health`

Checks whether the database is reachable.

```bash
curl http://localhost:3000/api/health
```

## Available Commands

The supplied documentation lists these scripts. Check `package.json` in your current checkout before relying on them.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |

Typical local verification:

```bash
npm run lint
npm run typecheck
npm run build
```

If a command is not defined in `package.json`, do not assume it is available.

## Deployment

This project needs a reachable PostgreSQL database as well as a compatible Node.js hosting environment.

General deployment checklist:

1. Push the project to your Git hosting provider.
2. Import the repository into your hosting provider.
3. Configure `DATABASE_URL` as a server-side environment variable.
4. Ensure the database schema has been applied to the intended database.
5. Run the production build.
6. Deploy the application.
7. Check `/api/health` and test the main prompt-generation flow.
8. Review all API routes for authentication, authorization, and rate limiting before making the app public.

The supplied notes suggest Vercel as one hosting option. Database schema configuration may need adjustment because the current Drizzle configuration reportedly uses a literal database URL.

## Troubleshooting

| Problem | What to check |
|---|---|
| `DATABASE_URL` missing | Confirm the root `.env` exists and contains the correct variable |
| PostgreSQL connection refused | Check that PostgreSQL is running, the port is correct, and the connection string matches |
| `prompts` table does not exist | Apply the Drizzle schema to the intended database |
| Health endpoint reports failure | Verify database credentials and network access |
| Port 3000 is occupied | Stop the other process or start Next.js on another port |
| Build fails | Review the full error, check the Node.js version, and verify dependencies are installed |

## Security

Before making the application publicly accessible:

- Add `.env`, `.env.*.local`, `node_modules/`, `.next/`, and log files to `.gitignore`.
- Confirm that no real credentials, API keys, tokens, or private configuration files are tracked by Git.
- Add authentication and authorization to endpoints that modify or delete data.
- Add rate limiting and input-abuse protections to public endpoints.
- Use a restricted database account and secure database connection settings in production.
- Back up important data before changing or resetting the schema.

Example `.gitignore` entries:

```gitignore
node_modules/
.next/
.env
.env.*
!.env.example
*.log
```

Review this list against your project's needs before replacing an existing `.gitignore`.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a focused branch for your change.
3. Keep changes consistent with the existing project conventions.
4. Run the available lint, type-check, and build commands.
5. Open a pull request describing the change and how it was tested.

For new industry profiles, inspect the existing profile structure in `src/lib/engine/industries.ts` and follow the patterns already used by the project.

## Roadmap

Potential follow-up improvements based on the supplied project notes:

- Add automated unit and end-to-end tests.
- Add authentication and rate limiting for public deployments.
- Add continuous integration for linting, type-checking, and builds.
- Add real screenshots and a short demo GIF.
- Add a license file once the owner chooses the project's license.

## License

**License not specified.** No license should be assumed until a `LICENSE` file is added. If you intend to publish this as open source, choose a license and include its complete text in the repository.

## Acknowledgments

PromptForge is built with open-source technologies including [Next.js](https://nextjs.org), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com), [Drizzle ORM](https://orm.drizzle.team), and [PostgreSQL](https://www.postgresql.org).

---

<div align="center">

**PROMPTFORGE**  
<sub>Turn a small idea into a clearer build plan.</sub>

</div>
