# @opedro-monteiro/create-feature

CLI to scaffold **Feature-Driven Architecture** modules for React / Next.js projects.

```bash
npx @opedro-monteiro/create-feature auth
# or
bunx @opedro-monteiro/create-feature auth
```

After a global install, you can also run:

```bash
npm i -g @opedro-monteiro/create-feature
create-feature auth
```

## Requirements

- Node.js 18+

If `src/features` does not exist, the CLI creates it automatically.

## What it generates

Every feature always includes:

```text
src/features/<feature>/
├── components/
├── hooks/
├── services/
├── utils/
│   └── <feature>.utils.ts
└── types/
    └── <feature>.types.ts
```

Interactive prompts also let you add optional folders and starter files:

| Option | Creates |
| --- | --- |
| schemas (Zod) | `schemas/` (+ schema file if selected) |
| storage | `storage/` + storage helper |
| api | `api/` + API helper |
| constants | `constants/` + constants file |
| store (Zustand) | `store/` (+ store file if selected) |
| actions | `actions/` + server action |
| tests | `__tests__/` (+ test file if main component is selected) |
| Main component | `<feature>.tsx` |
| index.ts barrel | `index.ts` with public exports |
| Service file | `services/<feature>.service.ts` |
| Custom hook | `hooks/use-<feature>.ts` |
| Zod schema | `schemas/<feature>.schema.ts` |
| Zustand store | `store/<feature>.store.ts` |

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
