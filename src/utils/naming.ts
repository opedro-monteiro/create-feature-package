import type { FeatureNames } from "../types.js";

/**
 * Converts a feature name into kebab, pascal, camel, and constant forms.
 */
export function toFeatureNames(raw: string): FeatureNames {
  const kebab = toKebabCase(raw);

  if (!kebab) {
    throw new Error(
      `Invalid feature name "${raw}". Use letters, numbers, spaces, hyphens, or underscores.`,
    );
  }

  const parts = kebab.split("-");
  const pascal = parts.map(capitalize).join("");
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  const constant = parts.map((part) => part.toUpperCase()).join("_");

  return { raw, kebab, pascal, camel, constant };
}

export function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function isValidFeatureName(value: string): boolean {
  try {
    toFeatureNames(value);
    return true;
  } catch {
    return false;
  }
}
