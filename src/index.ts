export { generateFeature } from "./generators/feature.js";
export type { GenerateFeatureResult } from "./generators/feature.js";
export { promptFeatureOptions } from "./prompts/feature.js";
export { toFeatureNames, toKebabCase, isValidFeatureName } from "./utils/naming.js";
export {
  resolveFeaturesRoot,
  assertFeatureDoesNotExist,
  ValidationError,
  FEATURES_DIR,
} from "./utils/validate.js";
export type { ResolveFeaturesRootResult } from "./utils/validate.js";
export type {
  FeatureOptions,
  FeatureNames,
  GeneratedPath,
  OptionalFolder,
  OptionalFile,
} from "./types.js";
