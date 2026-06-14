# network-mentor-ai

An AI-assisted web application for helping users understand, review, and improve drainage or utility network models through an interactive browser experience. The repository appears to be a modern TypeScript project built from a TanStack Start template and extended with Supabase-backed services, suggesting a hosted application with authentication, storage, or database-driven features. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Overview

`network-mentor-ai` appears to be an engineering-focused assistant application designed to act as a “mentor” for network modeling work. The repository structure shows a frontend application in `src/`, a backend or cloud integration layer in `supabase/`, and recent activity labeled “Update site info for publish,” which strongly suggests the project is being prepared for deployment as a web app rather than kept as a local-only prototype. [github](https://github.com/SWMMEnablement/network-mentor-ai)

The repository currently has no README, no description, no topics, no website, and no releases, so this file is intended to give the project a professional foundation and a clear statement of purpose. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## What the app is for

At a high level, this project looks like a browser-based assistant for infrastructure network workflows, especially where users need guidance interpreting models, checking configurations, or navigating engineering decisions. The name `network-mentor-ai`, the `supabase/` directory, and the active site-publishing changes together point to an application that combines a modern user interface with cloud-backed AI or data services. [github](https://github.com/SWMMEnablement/network-mentor-ai)

A practical product definition for the repo is:

- Help users ask questions about network models in plain language.
- Provide structured engineering guidance or recommendations.
- Surface model concepts, terminology, and workflow hints in a more accessible way.
- Create a reusable web interface for future SWMM- or network-related AI tools.
- Support persistent sessions, user data, or app configuration through Supabase. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Repository status

The current GitHub landing page provides a clear snapshot of the repo’s maturity and structure. [github](https://github.com/SWMMEnablement/network-mentor-ai)

- Repository: `SWMMEnablement/network-mentor-ai`. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Visibility: Private. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Default branch: `main`. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Commit count shown on the landing page: 21 commits. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Latest visible commit: `Update site info for publish`. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Main folders: `.lovable`, `src`, `supabase`. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Key files include `.env`, `package.json`, `bun.lock`, `bunfig.toml`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, and `components.json`. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Language mix reported by GitHub: TypeScript 97.6%, CSS 2.0%, JavaScript 0.4%. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- No description, website, topics, releases, or published packages are currently listed. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Technology stack

The repo structure points to a modern full-stack web application with a TypeScript frontend and Supabase integration. [github](https://github.com/SWMMEnablement/network-mentor-ai)

| Area | Evidence in repo | Likely role |
|---|---|---|
| Frontend language | TypeScript 97.6%  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Main application logic and UI. |
| Build tool | `vite.config.ts`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Local dev server and production build pipeline. |
| Runtime/package manager | `bun.lock`, `bunfig.toml`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Bun-based install and script execution. |
| Code quality | `eslint.config.js`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Linting and style enforcement. |
| Formatting | `.prettierrc`, `.prettierignore`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Consistent formatting. |
| UI/component setup | `components.json`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Structured component system. |
| App source | `src/`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Primary frontend code. |
| Backend/cloud integration | `supabase/`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Database, auth, functions, or configuration support. |
| Environment config | `.env`  [github](https://github.com/SWMMEnablement/network-mentor-ai) | Local secrets and deployment settings. |

The presence of TanStack-style template files in the initial history indicates the repo likely started from a `tanstack_start_ts` scaffold and was then adapted into a domain-specific application. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Core concept

The strongest README framing for this repo is to position it as an engineering copilot for network modeling rather than a general chatbot. That framing better matches the repository name and the SWMM-focused organization context visible on GitHub. [github](https://github.com/SWMMEnablement/network-mentor-ai)

A useful description is:

> `network-mentor-ai` is a web application that helps engineers and analysts understand network model structure, ask workflow questions, and receive AI-assisted guidance in a focused interface designed for infrastructure and hydraulic modeling tasks. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Suggested features

The current repository page does not expose actual `src` implementation details, so the list below is written as a feature-oriented project definition based on the visible structure and naming. [github](https://github.com/SWMMEnablement/network-mentor-ai)

### Current or intended capabilities

- **AI-guided network assistance**: A conversational or prompt-driven interface for helping users interpret model structure, concepts, and workflow decisions.
- **Engineering-focused UX**: A product identity centered on network modeling rather than general-purpose chat.
- **Supabase-backed application services**: Support for persistent app state, authentication, storage, database records, or server-side workflows through the included `supabase/` directory. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- **Browser-based deployment**: Recent “publish” changes suggest the app is being prepared for hosted use rather than only local development. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- **Modern TypeScript architecture**: Strongly typed code organized for maintainability and future extension. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Use cases

This repo is well positioned for several practical use cases in water, wastewater, stormwater, or other utility-network workflows:

- Answering terminology and workflow questions for newer modelers.
- Providing guidance on network setup and interpretation.
- Acting as an onboarding assistant for complex modeling environments.
- Offering contextual explanations of nodes, links, assets, and common engineering patterns.
- Serving as the foundation for future model-review or QA assistance tools.

For example, a user could ask how to think about a problematic reach, why a network representation behaves unexpectedly, or what information should be checked before rerunning a simulation.

## Project structure

The live repo page shows the following top-level structure. [github](https://github.com/SWMMEnablement/network-mentor-ai)

```text
network-mentor-ai/
├─ .lovable/             # Lovable project metadata or AI-assisted build scaffolding
├─ src/                  # Main application source code
├─ supabase/             # Supabase configuration, schema, or backend logic
├─ .env                  # Local environment variables
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ bun.lock
├─ bunfig.toml
├─ components.json
├─ eslint.config.js
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

As the codebase becomes more stable, this section should be expanded to show actual internal folders such as:

```text
src/
├─ components/           # Reusable UI components
├─ routes/               # Pages or route handlers
├─ lib/                  # Shared utilities and helpers
├─ features/             # Domain-specific app modules
├─ services/             # API or AI service integration
├─ hooks/                # State and data hooks
└─ styles/               # Styling and theme files
```

## Getting started

The presence of `package.json`, `bun.lock`, and `bunfig.toml` makes Bun the most likely default workflow. [github](https://github.com/SWMMEnablement/network-mentor-ai)

### Prerequisites

- Bun installed locally.
- Git installed.
- Access to any required Supabase project configuration.
- A local `.env` file with required keys and URLs if they are not already present. [github](https://github.com/SWMMEnablement/network-mentor-ai)

### Installation

```bash
git clone https://github.com/SWMMEnablement/network-mentor-ai.git
cd network-mentor-ai
bun install
```

### Start development server

```bash
bun run dev
```

### Build for production

```bash
bun run build
```

### Preview production build

```bash
bun run preview
```

If the actual script names in `package.json` differ, revise the commands above to match the repository exactly. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Environment configuration

The repository includes a tracked `.env` file, which means environment configuration is already part of the project setup.  For a cleaner long-term workflow, it is usually better to keep a `.env.example` file in version control and reserve `.env` for local secrets. [github](https://github.com/SWMMEnablement/network-mentor-ai)

A typical environment section for this repo could look like:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_api_key
```

Only include variables here that are actually used by the application.

## Supabase integration

The visible `supabase/` folder is the clearest sign that this project is more than a static frontend.  In a repo like this, Supabase may be handling one or more of the following: [github](https://github.com/SWMMEnablement/network-mentor-ai)

- Authentication and user sessions.
- Prompt or chat history persistence.
- Structured storage of engineering content or reference material.
- Edge functions or server-side actions.
- Role-based access for private tools.

This section should be updated once the exact schema or services are known.

## Development guidelines

Because this is likely an AI-enabled engineering application, the codebase will be easier to maintain if responsibilities are separated cleanly:

- Keep domain logic independent from UI components.
- Encapsulate AI prompt construction and response parsing in dedicated service layers.
- Store infrastructure-specific definitions and terminology in structured files or typed modules.
- Avoid scattering Supabase queries directly across presentational components.
- Add clear boundaries between frontend state, cloud persistence, and AI orchestration.

That structure will make it much easier to evolve the app from a prototype into a dependable internal tool.

## Testing

No test framework is visible on the repository landing page, so this section should be treated as a recommended next step. [github](https://github.com/SWMMEnablement/network-mentor-ai)

A strong testing plan for this project would include:

- Unit tests for utility and validation logic.
- Component tests for prompt flows and core UI behavior.
- Integration tests for Supabase-backed data operations.
- End-to-end tests for sign-in, question flow, and response handling.
- Regression tests for engineering-specific prompts and expected output patterns.

## Deployment

The latest commit message, “Update site info for publish,” indicates the application is being readied for deployment.  Once the hosting platform is confirmed, this section should document: [github](https://github.com/SWMMEnablement/network-mentor-ai)

- Production URL.
- Deployment provider.
- Environment variables required in production.
- Build command and output behavior.
- Release and rollback workflow.

## Roadmap

The current repository metadata suggests a project that is actively evolving but not yet documented publicly.  Useful next steps include: [github](https://github.com/SWMMEnablement/network-mentor-ai)

- Add a repository description, topics, and website metadata. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Replace inferred feature descriptions with actual app screenshots and workflows.
- Document Supabase setup and schema dependencies.
- Add `.env.example` and stop tracking sensitive environment values if needed. [github](https://github.com/SWMMEnablement/network-mentor-ai)
- Add test coverage for key user flows.
- Publish a first tagged release when deployment stabilizes. [github](https://github.com/SWMMEnablement/network-mentor-ai)

## Contributing

Contributions should improve either engineering usefulness, product clarity, or code maintainability. Good pull requests should:

- Focus on one user-facing feature or backend concern at a time.
- Explain the workflow improvement in plain language.
- Include screenshots for UI changes.
- Note any new environment variables or Supabase migrations.
- Update this README when setup or behavior changes.

## Metadata suggestions

The repo currently has no description, topics, or website listed on GitHub.  A strong starting point would be: [github](https://github.com/SWMMEnablement/network-mentor-ai)

- Description: AI-assisted web app for mentoring and guiding infrastructure network modeling workflows.
- Topics: `ai`, `typescript`, `supabase`, `vite`, `engineering`, `swmm`, `network-modeling`, `web-app`.
- Website: Add the deployed app URL after publication.

## License

No license is currently visible on the repository page.  Until a license file is added, reuse and redistribution are limited to the repository owner’s default rights. [github](https://github.com/SWMMEnablement/network-mentor-ai)

A placeholder section can be:

```text
License details will be added once the intended distribution model is finalized.
```

## Acknowledgments

The repository is maintained under the `SWMMEnablement` organization and shows recent commits from both `dickinsonre` and `lovable-dev[bot]`, which suggests a workflow combining domain expertise with AI-assisted application development. [github](https://github.com/SWMMEnablement/network-mentor-ai)

The two biggest upgrades to this README would be adding the actual `package.json` scripts and documenting what lives inside `src/` and `supabase/`. [github](https://github.com/SWMMEnablement/network-mentor-ai)
