export type OptionalFolder =
  | "schemas"
  | "storage"
  | "api"
  | "constants"
  | "store"
  | "actions"
  | "tests";

export type OptionalFile =
  | "mainComponent"
  | "indexBarrel"
  | "service"
  | "hook"
  | "schema"
  | "store";

export interface FeatureOptions {
  name: string;
  /**
   * Path to the project's `src` directory (relative to cwd or absolute).
   * Defaults to `./src`.
   * Example: `apps/web/src` in a monorepo.
   */
  srcDir: string;
  folders: {
    schemas: boolean;
    storage: boolean;
    api: boolean;
    constants: boolean;
    store: boolean;
    actions: boolean;
    tests: boolean;
  };
  files: {
    mainComponent: boolean;
    indexBarrel: boolean;
    service: boolean;
    hook: boolean;
    schema: boolean;
    store: boolean;
  };
}

export interface FeatureNames {
  /** Original input, e.g. "user-auth" */
  raw: string;
  /** Folder / file slug, e.g. "user-auth" */
  kebab: string;
  /** Component name, e.g. "UserAuth" */
  pascal: string;
  /** Hook / variable name, e.g. "userAuth" */
  camel: string;
  /** Constant prefix, e.g. "USER_AUTH" */
  constant: string;
}

export interface GeneratedPath {
  relative: string;
  absolute: string;
  kind: "directory" | "file";
}
