#!/usr/bin/env node
import * as p from "@clack/prompts";
import pc from "picocolors";
import { generateFeature } from "./generators/feature.js";
import { promptFeatureOptions } from "./prompts/feature.js";
import { ValidationError } from "./utils/validate.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  const featureArg = args[0];

  console.log();
  p.intro(pc.bgCyan(pc.black(" create-react-feature ")));

  p.note(
    [
      "Scaffolds a Feature-Driven Architecture module under <src>/features/",
      "Compatible with React and Next.js projects (including monorepos)",
    ].join("\n"),
    "Feature CLI",
  );

  try {
    const options = await promptFeatureOptions(featureArg);

    const spinner = p.spinner();
    spinner.start(`Creating feature "${options.name}"...`);

    const result = await generateFeature(options);

    spinner.stop(`Feature "${result.names.kebab}" created`);

    if (result.featuresRootCreated) {
      p.log.info(
        `Created missing ${pc.cyan(result.featuresRootRelative)} directory`,
      );
    }

    const folders = result.created
      .filter((item) => item.kind === "directory")
      .map((item) => `  ${pc.dim("dir")}  ${item.relative}`);
    const files = result.created
      .filter((item) => item.kind === "file")
      .map((item) => `  ${pc.green("file")} ${item.relative}`);

    p.note([...folders, ...files].join("\n") || "Nothing created", "Generated");

    p.outro(
      `${pc.green("Done!")} Feature ready at ${pc.cyan(result.featurePathRelative)}`,
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      p.log.error(error.message);
      p.outro(pc.red("Aborted"));
      process.exit(1);
    }

    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";
    p.log.error(message);
    p.outro(pc.red("Aborted"));
    process.exit(1);
  }
}

main();
