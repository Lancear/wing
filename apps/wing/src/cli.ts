// for WebAssembly typings:
/// <reference lib="dom" />

import { compile, docs, test, checkForUpdates, run } from "./commands";
import { satisfies } from "compare-versions";

import { Command, Option } from "commander";
import { run_server } from "./commands/lsp";

import { collectCommandAnalytics } from "./analytics/collect";
import { exportAnalytics } from "./analytics/export";


const PACKAGE_VERSION = require("../package.json").version as string;

const ANALYTICS_OPT_OUT = process.env.WING_DISABLE_ANALYTICS || PACKAGE_VERSION == "0.0.0" ? true : false; 
let ANALYTICS_EXPORT_FILE: string | undefined = undefined;

console.log("COLLECT ANALYTICS:", ANALYTICS_OPT_OUT);
const SUPPORTED_NODE_VERSION = require("../package.json").engines.node as string;
if (!SUPPORTED_NODE_VERSION) {
  throw new Error("couldn't parse engines.node version from package.json");
}

function actionErrorHandler(fn: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      const exitCode = await fn(...args);
      if (exitCode === 1) {
        process.exit(1);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
}

async function main() {
  checkNodeVersion();

  const program = new Command();
  
  program.name("wing").version(PACKAGE_VERSION);

  program.option("--debug", "Enable debug logging (same as DEBUG=1)", () => {
    process.env.DEBUG = "1";
  });

  program.option("--progress", "Show compilation progress", () => {
    process.env.PROGRESS = "1";
  });

  program
    .option("--no-progress", "Hide show compilation progress")
    .option("--no-update-check", "Skip checking for toolchain updates")
    .hook("preAction", async (cmd) => {
      const updateCheck = cmd.opts().updateCheck;
      if (updateCheck) {
        // most of the update check is network bound, so we don't want to block the rest of the CLI
        void checkForUpdates();
      }
    });

  
  async function collectAnalyticsHook(cmd: Command) {
    if (ANALYTICS_OPT_OUT) { return; }

    // Fail silently if collection fails
    try {
      ANALYTICS_EXPORT_FILE = await collectCommandAnalytics(cmd);
    } catch (err) {
      // ignore
    }
  }

  async function exportAnalyticsHook() {
    if (ANALYTICS_OPT_OUT) { return; }

    // Fail silently if export fails
    try {
      if (ANALYTICS_EXPORT_FILE) {
        exportAnalytics(ANALYTICS_EXPORT_FILE);
      }
    } catch (err) {
      // ignore
    }
  }

  async function progressHook(cmd: Command) {
    const target = cmd.opts().target;
    const progress = program.opts().progress;
    if (progress !== false && target !== "sim") {
      process.env.PROGRESS = "1";
    }
  }

  program
    .command("run")
    .alias("it")
    .description("Runs a Wing program in the Wing Console")
    .argument("[entrypoint]", "program .w entrypoint")
    .option("-p, --port <port>", "specify port")
    .option("--no-open", "Do not open the Wing Console in the browser")
    .hook("preAction", collectAnalyticsHook)
    .action(run);

  program.command("lsp").description("Run the Wing language server on stdio").hook("preAction", collectAnalyticsHook).action(run_server);

  program
    .command("compile")
    .description("Compiles a Wing program")
    .argument("<entrypoint>", "program .w entrypoint")
    .addOption(
      new Option("-t, --target <target>", "Target platform")
        .choices(["tf-aws", "tf-azure", "tf-gcp", "sim", "awscdk"])
        .default("sim")
    )
    .option("-p, --plugins [plugin...]", "Compiler plugins")
    .hook("preAction", progressHook)
    .hook("preAction", collectAnalyticsHook)
    .action(actionErrorHandler(compile));

  program
    .command("test")
    .description(
      "Compiles a Wing program and runs all functions with the word 'test' or start with 'test:' in their resource identifiers"
    )
    .argument("<entrypoint...>", "all entrypoints to test")
    .addOption(
      new Option("-t, --target <target>", "Target platform")
        .choices(["tf-aws", "tf-azure", "tf-gcp", "sim", "awscdk"])
        .default("sim")
    )
    .option("-p, --plugins [plugin...]", "Compiler plugins")
    .hook("preAction", progressHook)
    .hook("preAction", collectAnalyticsHook)
    .action(actionErrorHandler(test));

  program.command("docs").description("Open the Wing documentation").hook("preAction", collectAnalyticsHook).action(docs);

  program.hook("postAction", exportAnalyticsHook)
  program.parse();
}

function checkNodeVersion() {
  const supportedVersion = SUPPORTED_NODE_VERSION;

  if (!satisfies(process.version, supportedVersion)) {
    console.warn(
      `WARNING: You are running an incompatible node.js version ${process.version}. Compatible engine is: ${supportedVersion}.`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

