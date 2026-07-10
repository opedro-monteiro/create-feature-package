# create-react-feature

CLI to scaffold **Feature-Driven Architecture** modules for React / Next.js projects.

```bash
npx create-react-feature auth
# or
bunx create-react-feature auth
# or
pnpm dlx create-react-feature auth
```

After a global install, you can also run:

```bash
npm i -g create-react-feature
create-react-feature auth
```

## Requirements

- Node.js 18+

The CLI asks where your `src` directory is (default: `./src`).  
Useful in monorepos, for example:

```text
web/
├── apps/
│   └── src/          ← point here: apps/src
└── api/
```

If `<src>/features` does not exist, it is created automatically.

## What it generates

Every feature always includes:

```text
<src>/features/<feature>/
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
import { generateFeature } from "create-react-feature";

await generateFeature({
  name: "auth",
  srcDir: "apps/web/src", // default: "./src"
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
