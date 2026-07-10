import path from "node:path";
import { ensureDir, pathExists } from "./fs.js";

export const FEATURES_DIR = path.join("src", "features");

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface ResolveFeaturesRootResult {
  featuresRoot: string;
  created: boolean;
}

/**
 * Resolves `src/features`, creating it (and `src/`) when missing.
 */
export async function resolveFeaturesRoot(
  cwd: string = process.cwd(),
): Promise<ResolveFeaturesRootResult> {
  const featuresRoot = path.join(cwd, FEATURES_DIR);
  const created = !(await pathExists(featuresRoot));

  if (created) {
    await ensureDir(featuresRoot);
  }

  return { featuresRoot, created };
}

export async function assertFeatureDoesNotExist(
  featuresRoot: string,
  featureKebab: string,
): Promise<string> {
  const featurePath = path.join(featuresRoot, featureKebab);

  if (await pathExists(featurePath)) {
    throw new ValidationError(
      `Feature "${featureKebab}" already exists at ${path.relative(process.cwd(), featurePath)}`,
    );
  }

  return featurePath;
}
