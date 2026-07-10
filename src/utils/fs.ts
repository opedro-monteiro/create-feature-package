import { mkdir, writeFile, access, constants } from "node:fs/promises";
import path from "node:path";

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

export async function writeTextFile(
  filePath: string,
  contents: string,
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, contents, "utf8");
}

/**
 * Creates an empty directory with a `.gitkeep` so empty folders are tracked.
 */
export async function ensureTrackedDir(dirPath: string): Promise<void> {
  await ensureDir(dirPath);
  await writeTextFile(path.join(dirPath, ".gitkeep"), "");
}
