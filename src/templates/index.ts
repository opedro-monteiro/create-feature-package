import type { FeatureNames } from "../types.js";

export type TemplateContext = FeatureNames;

export function mainComponentTemplate({ pascal, kebab }: TemplateContext): string {
  return `export function ${pascal}() {
  return (
    <section data-feature="${kebab}">
      <h1>${pascal}</h1>
    </section>
  );
}
`;
}

export function indexBarrelTemplate(
  ctx: TemplateContext & {
    files: {
      mainComponent: boolean;
      service: boolean;
      hook: boolean;
      schema: boolean;
      store: boolean;
    };
  },
): string {
  const { pascal, camel, kebab, files } = ctx;
  const lines: string[] = [];

  if (files.mainComponent) {
    lines.push(`export { ${pascal} } from "./${kebab}";`);
  }

  if (files.hook) {
    lines.push(`export { use${pascal} } from "./hooks/use-${kebab}";`);
  }

  if (files.service) {
    lines.push(
      `export { ${camel}Service } from "./services/${kebab}.service";`,
    );
  }

  if (files.schema) {
    lines.push(
      `export { ${camel}Schema, type ${pascal}Schema } from "./schemas/${kebab}.schema";`,
    );
  }

  if (files.store) {
    lines.push(
      `export { use${pascal}Store } from "./store/${kebab}.store";`,
    );
  }

  if (lines.length === 0) {
    return `// Public API for the ${kebab} feature\n`;
  }

  return `${lines.join("\n")}\n`;
}

export function serviceTemplate({ camel, pascal }: TemplateContext): string {
  return `export const ${camel}Service = {
  async get${pascal}() {
    // TODO: implement ${camel} service
    throw new Error("Not implemented");
  },
};
`;
}

export function hookTemplate({ pascal, camel }: TemplateContext): string {
  return `import { useState } from "react";

export function use${pascal}() {
  const [isLoading, setIsLoading] = useState(false);

  // TODO: implement ${camel} hook logic

  return {
    isLoading,
    setIsLoading,
  };
}
`;
}

export function schemaTemplate({ camel, pascal }: TemplateContext): string {
  return `import { z } from "zod";

export const ${camel}Schema = z.object({
  id: z.string(),
  // TODO: define ${camel} fields
});

export type ${pascal}Schema = z.infer<typeof ${camel}Schema>;
`;
}

export function storeTemplate({ pascal, camel }: TemplateContext): string {
  return `import { create } from "zustand";

interface ${pascal}State {
  // TODO: define ${camel} store state
}

interface ${pascal}Actions {
  reset: () => void;
}

const initialState: ${pascal}State = {};

export const use${pascal}Store = create<${pascal}State & ${pascal}Actions>((set) => ({
  ...initialState,
  reset: () => set(initialState),
}));
`;
}

export function typesTemplate({ pascal }: TemplateContext): string {
  return `export interface ${pascal} {
  id: string;
  // TODO: extend ${pascal} type
}
`;
}

export function utilsTemplate({ pascal }: TemplateContext): string {
  return `export function format${pascal}Label(value: string): string {
  return value.trim();
}
`;
}

export function constantsTemplate({
  constant,
  kebab,
}: TemplateContext): string {
  return `export const ${constant}_FEATURE = "${kebab}" as const;

export const ${constant}_KEYS = {
  // TODO: add ${constant} keys
} as const;
`;
}

export function apiTemplate({ camel, pascal }: TemplateContext): string {
  return `export async function fetch${pascal}() {
  // TODO: call ${camel} API endpoint
  throw new Error("Not implemented");
}
`;
}

export function storageTemplate({ camel, pascal }: TemplateContext): string {
  return `const ${camel}StorageKey = "${camel}";

export const ${camel}Storage = {
  get(): ${pascal}StorageValue | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(${camel}StorageKey);
    return raw ? (JSON.parse(raw) as ${pascal}StorageValue) : null;
  },
  set(value: ${pascal}StorageValue): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(${camel}StorageKey, JSON.stringify(value));
  },
  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(${camel}StorageKey);
  },
};

export interface ${pascal}StorageValue {
  // TODO: define ${camel} storage shape
}
`;
}

export function actionsTemplate({ camel, pascal }: TemplateContext): string {
  return `"use server";

export async function ${camel}Action() {
  // TODO: implement ${pascal} server action
  throw new Error("Not implemented");
}
`;
}

export function testTemplate({ pascal, kebab }: TemplateContext): string {
  return `import { describe, it, expect } from "vitest";
import { ${pascal} } from "../${kebab}";

describe("${pascal}", () => {
  it("is defined", () => {
    expect(${pascal}).toBeDefined();
  });
});
`;
}

export const templates = {
  mainComponent: mainComponentTemplate,
  indexBarrel: indexBarrelTemplate,
  service: serviceTemplate,
  hook: hookTemplate,
  schema: schemaTemplate,
  store: storeTemplate,
  types: typesTemplate,
  utils: utilsTemplate,
  constants: constantsTemplate,
  api: apiTemplate,
  storage: storageTemplate,
  actions: actionsTemplate,
  test: testTemplate,
} as const;
