# @opedro-monteiro/create-feature

CLI to scaffold **Feature-Driven Architecture** modules for React / Next.js projects.

```bash
npx @opedro-monteiro/create-feature auth
# or
bunx @opedro-monteiro/create-feature auth
```

## Requirements

- Node.js 18+

If `src/features` does not exist, the CLI creates it automatically.

## What it generates

By default, every feature includes:

```text
src/features/<feature>/
├── components/
├── hooks/
├── services/
├── utils/
├── types/
├── index.ts          # optional (prompt)
└── <feature>.tsx     # optional (prompt)
```

Interactive prompts let you add:

| Option | Creates |
| --- | --- |
| schemas (Zod) | `schemas/` + optional schema file |
| storage | `storage/` |
| api | `api/` |
| constants | `constants/` |
| store (Zustand) | `store/` + optional store file |
| actions | `actions/` |
| tests | `__tests__/` |

## Local development

```bash
npm install
npm run build
npm run dev -- auth
```

## Programmatic API

```ts
import { generateFeature } from "@opedro-monteiro/create-feature";

await generateFeature({
  name: "auth",
  folders: {
    schemas: true,
    storage: false,
    api: false,
    constants: false,
    store: true,
    actions: false,
    tests: false,
  },
  files: {
    mainComponent: true,
    indexBarrel: true,
    service: true,
    hook: true,
    schema: true,
    store: true,
  },
});
```

## Publish

```bash
npm login
npm publish
```

## Project structure

```text
src/
├── cli.ts                 # CLI entrypoint
├── index.ts               # Public API
├── types.ts
├── prompts/               # Interactive questions
├── generators/            # File/folder generation
├── templates/             # Starter file contents
└── utils/                 # Naming, fs, validation
```
