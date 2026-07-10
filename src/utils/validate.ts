import path from "node:path";
import { ensureDir, pathExists } from "./fs.js";

export const DEFAULT_SRC_DIR = "./src";
export const FEATURES_FOLDER = "features";

/** @deprecated Use FEATURES_FOLDER with a custom srcDir instead */
export const FEATURES_DIR = path.join("src", FEATURES_FOLDER);

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface ResolveFeaturesRootResult {
  /** Absolute path to `<srcDir>/features` */
  featuresRoot: string;
  /** Absolute path to the resolved `src` directory */
  srcRoot: string;
  /** Relative path from cwd to features root (for display) */
  featuresRootRelative: string;
  created: boolean;
}

/**
 * Resolves `<srcDir>/features`, creating it when missing.
 */
export async function resolveFeaturesRoot(
  srcDir: string = DEFAULT_SRC_DIR,
  cwd: string = process.cwd(),
): Promise<ResolveFeaturesRootResult> {
  const srcRoot = path.resolve(cwd, srcDir);
  const featuresRoot = path.join(srcRoot, FEATURES_FOLDER);
  const created = !(await pathExists(featuresRoot));

  if (created) {
    await ensureDir(featuresRoot);
  }

  return {
    featuresRoot,
    srcRoot,
    featuresRootRelative: toDisplayPath(cwd, featuresRoot),
    created,
  };
}

export async function assertFeatureDoesNotExist(
  featuresRoot: string,
  featureKebab: string,
  cwd: string = process.cwd(),
): Promise<string> {
  const featurePath = path.join(featuresRoot, featureKebab);

  if (await pathExists(featurePath)) {
    throw new ValidationError(
      `Feature "${featureKebab}" already exists at ${toDisplayPath(cwd, featurePath)}`,
    );
  }

  return featurePath;
}

export function toDisplayPath(cwd: string, absolutePath: string): string {
  const relative = path.relative(cwd, absolutePath);
  if (!relative || relative === "") return ".";
  // Prefer ./src style for paths under cwd
  if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
    return relative.startsWith(".") ? relative : `./${relative}`;
  }
  return relative;
}

export function normalizeSrcDir(srcDir: string): string {
  const trimmed = srcDir.trim() || DEFAULT_SRC_DIR;
  // Keep trailing semantics simple: strip trailing slashes except root
  return trimmed.replace(/[\\/]+$/, "") || DEFAULT_SRC_DIR;
}
