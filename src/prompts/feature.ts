import * as p from "@clack/prompts";
import type { FeatureOptions } from "../types.js";
import { isValidFeatureName, toKebabCase } from "../utils/naming.js";

function handleCancel(value: unknown): asserts value is string | boolean | string[] {
  if (p.isCancel(value)) {
    p.cancel("Feature creation cancelled.");
    process.exit(0);
  }
}

/**
 * Collects feature name + optional folders/files via interactive prompts.
 */
export async function promptFeatureOptions(
  initialName?: string,
): Promise<FeatureOptions> {
  let name = initialName?.trim() ?? "";

  if (!name) {
    const nameAnswer = await p.text({
      message: "What is the feature name?",
      placeholder: "auth",
      validate(value) {
        const trimmed = value?.trim() ?? "";
        if (!trimmed) return "Feature name is required.";
        if (!isValidFeatureName(trimmed)) {
          return "Use letters, numbers, spaces, hyphens, or underscores.";
        }
      },
    });
    handleCancel(nameAnswer);
    name = String(nameAnswer).trim();
  } else if (!isValidFeatureName(name)) {
    p.log.error(
      `Invalid feature name "${name}". Use letters, numbers, spaces, hyphens, or underscores.`,
    );
    process.exit(1);
  }

  p.log.info(`Feature slug: ${toKebabCase(name)}`);

  const foldersAnswer = await p.multiselect({
    message: "Which optional folders should be included?",
    options: [
      { value: "schemas", label: "schemas", hint: "Zod schemas" },
      { value: "storage", label: "storage", hint: "local/session storage helpers" },
      { value: "api", label: "api", hint: "API client functions" },
      { value: "constants", label: "constants" },
      { value: "store", label: "store", hint: "Zustand store" },
      { value: "actions", label: "actions", hint: "Server actions" },
      { value: "tests", label: "__tests__", hint: "Unit tests" },
    ],
    required: false,
  });
  handleCancel(foldersAnswer);

  const selectedFolders = new Set(foldersAnswer as string[]);

  const filesAnswer = await p.multiselect({
    message: "Which starter files should be created?",
    options: [
      {
        value: "mainComponent",
        label: "Main component",
        hint: "<feature>.tsx",
      },
      {
        value: "indexBarrel",
        label: "index.ts barrel",
        hint: "public exports",
      },
      {
        value: "service",
        label: "Service file",
        hint: "services/<feature>.service.ts",
      },
      {
        value: "hook",
        label: "Custom hook",
        hint: "hooks/use-<feature>.ts",
      },
      {
        value: "schema",
        label: "Zod schema",
        hint: "schemas/<feature>.schema.ts",
      },
      {
        value: "store",
        label: "Zustand store",
        hint: "store/<feature>.store.ts",
      },
    ],
    initialValues: ["mainComponent", "indexBarrel", "service", "hook"],
    required: false,
  });
  handleCancel(filesAnswer);

  const selectedFiles = new Set(filesAnswer as string[]);

  // Selecting a schema/store file implies the matching folder
  if (selectedFiles.has("schema")) selectedFolders.add("schemas");
  if (selectedFiles.has("store")) selectedFolders.add("store");

  return {
    name,
    folders: {
      schemas: selectedFolders.has("schemas"),
      storage: selectedFolders.has("storage"),
      api: selectedFolders.has("api"),
      constants: selectedFolders.has("constants"),
      store: selectedFolders.has("store"),
      actions: selectedFolders.has("actions"),
      tests: selectedFolders.has("tests"),
    },
    files: {
      mainComponent: selectedFiles.has("mainComponent"),
      indexBarrel: selectedFiles.has("indexBarrel"),
      service: selectedFiles.has("service"),
      hook: selectedFiles.has("hook"),
      schema: selectedFiles.has("schema"),
      store: selectedFiles.has("store"),
    },
  };
}
