import path from "node:path";
import type { FeatureNames, FeatureOptions, GeneratedPath } from "../types.js";
import { templates } from "../templates/index.js";
import { ensureTrackedDir, writeTextFile } from "../utils/fs.js";
import { toFeatureNames } from "../utils/naming.js";
import {
  assertFeatureDoesNotExist,
  resolveFeaturesRoot,
} from "../utils/validate.js";

export interface GenerateFeatureResult {
  featurePath: string;
  names: FeatureNames;
  created: GeneratedPath[];
  featuresRootCreated: boolean;
}

/**
 * Scaffolds a feature module under `src/features/<name>`.
 * Creates `src/features` automatically when it does not exist.
 */
export async function generateFeature(
  options: FeatureOptions,
  cwd: string = process.cwd(),
): Promise<GenerateFeatureResult> {
  const names = toFeatureNames(options.name);
  const { featuresRoot, created: featuresRootCreated } =
    await resolveFeaturesRoot(cwd);
  const featurePath = await assertFeatureDoesNotExist(
    featuresRoot,
    names.kebab,
  );

  const created: GeneratedPath[] = [];

  const track = async (
    relative: string,
    kind: "directory" | "file",
    write?: () => Promise<void>,
  ) => {
    const absolute = path.join(featurePath, relative);
    if (write) {
      await write();
    }
    created.push({
      relative: path.join("src", "features", names.kebab, relative),
      absolute,
      kind,
    });
  };

  // Always-present base folders
  const baseFolders = ["components", "hooks", "services", "utils", "types"];

  for (const folder of baseFolders) {
    await track(folder, "directory", () =>
      ensureTrackedDir(path.join(featurePath, folder)),
    );
  }

  // Optional folders
  const optionalFolderMap: Array<{
    key: keyof FeatureOptions["folders"];
    folder: string;
  }> = [
    { key: "schemas", folder: "schemas" },
    { key: "storage", folder: "storage" },
    { key: "api", folder: "api" },
    { key: "constants", folder: "constants" },
    { key: "store", folder: "store" },
    { key: "actions", folder: "actions" },
    { key: "tests", folder: "__tests__" },
  ];

  for (const { key, folder } of optionalFolderMap) {
    if (!options.folders[key]) continue;
    await track(folder, "directory", () =>
      ensureTrackedDir(path.join(featurePath, folder)),
    );
  }

  // Always create a starter types file
  await track(
    path.join("types", `${names.kebab}.types.ts`),
    "file",
    () =>
      writeTextFile(
        path.join(featurePath, "types", `${names.kebab}.types.ts`),
        templates.types(names),
      ),
  );

  // Always create a starter utils file
  await track(
    path.join("utils", `${names.kebab}.utils.ts`),
    "file",
    () =>
      writeTextFile(
        path.join(featurePath, "utils", `${names.kebab}.utils.ts`),
        templates.utils(names),
      ),
  );

  if (options.files.mainComponent) {
    await track(`${names.kebab}.tsx`, "file", () =>
      writeTextFile(
        path.join(featurePath, `${names.kebab}.tsx`),
        templates.mainComponent(names),
      ),
    );
  }

  if (options.files.service) {
    await track(
      path.join("services", `${names.kebab}.service.ts`),
      "file",
      () =>
        writeTextFile(
          path.join(featurePath, "services", `${names.kebab}.service.ts`),
          templates.service(names),
        ),
    );
  }

  if (options.files.hook) {
    await track(path.join("hooks", `use-${names.kebab}.ts`), "file", () =>
      writeTextFile(
        path.join(featurePath, "hooks", `use-${names.kebab}.ts`),
        templates.hook(names),
      ),
    );
  }

  if (options.files.schema || options.folders.schemas) {
    if (!options.folders.schemas) {
      await track("schemas", "directory", () =>
        ensureTrackedDir(path.join(featurePath, "schemas")),
      );
    }

    if (options.files.schema) {
      await track(
        path.join("schemas", `${names.kebab}.schema.ts`),
        "file",
        () =>
          writeTextFile(
            path.join(featurePath, "schemas", `${names.kebab}.schema.ts`),
            templates.schema(names),
          ),
      );
    }
  }

  if (options.files.store || options.folders.store) {
    if (!options.folders.store) {
      await track("store", "directory", () =>
        ensureTrackedDir(path.join(featurePath, "store")),
      );
    }

    if (options.files.store) {
      await track(
        path.join("store", `${names.kebab}.store.ts`),
        "file",
        () =>
          writeTextFile(
            path.join(featurePath, "store", `${names.kebab}.store.ts`),
            templates.store(names),
          ),
      );
    }
  }

  if (options.folders.constants) {
    await track(
      path.join("constants", `${names.kebab}.constants.ts`),
      "file",
      () =>
        writeTextFile(
          path.join(featurePath, "constants", `${names.kebab}.constants.ts`),
          templates.constants(names),
        ),
    );
  }

  if (options.folders.api) {
    await track(path.join("api", `${names.kebab}.api.ts`), "file", () =>
      writeTextFile(
        path.join(featurePath, "api", `${names.kebab}.api.ts`),
        templates.api(names),
      ),
    );
  }

  if (options.folders.storage) {
    await track(
      path.join("storage", `${names.kebab}.storage.ts`),
      "file",
      () =>
        writeTextFile(
          path.join(featurePath, "storage", `${names.kebab}.storage.ts`),
          templates.storage(names),
        ),
    );
  }

  if (options.folders.actions) {
    await track(
      path.join("actions", `${names.kebab}.actions.ts`),
      "file",
      () =>
        writeTextFile(
          path.join(featurePath, "actions", `${names.kebab}.actions.ts`),
          templates.actions(names),
        ),
    );
  }

  if (options.folders.tests && options.files.mainComponent) {
    await track(
      path.join("__tests__", `${names.kebab}.test.tsx`),
      "file",
      () =>
        writeTextFile(
          path.join(featurePath, "__tests__", `${names.kebab}.test.tsx`),
          templates.test(names),
        ),
    );
  }

  if (options.files.indexBarrel) {
    await track("index.ts", "file", () =>
      writeTextFile(
        path.join(featurePath, "index.ts"),
        templates.indexBarrel({
          ...names,
          files: options.files,
        }),
      ),
    );
  }

  return { featurePath, names, created, featuresRootCreated };
}
