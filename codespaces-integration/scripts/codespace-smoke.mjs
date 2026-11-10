#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const ALLOWED_REPO = process.env.HC_CODESPACE_REPO || "Tawgod/Lightspeed";
const ALLOWED_BRANCH =
  process.env.HC_CODESPACE_BRANCH ||
  "feature/first-owner-passkey-registration-integration-20261110";
const IDLE_TIMEOUT = process.env.HC_CODESPACE_IDLE_TIMEOUT || "30m";

function fail(message, code = 1) {
  console.error(JSON.stringify({ ok: false, error: message }));
  process.exit(code);
}

function runGh(args, { inherit = false } = {}) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
    env: process.env,
    shell: false,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = inherit ? "" : (result.stderr || result.stdout || "").trim();
    throw new Error(`gh exited ${result.status}${detail ? `: ${detail}` : ""}`);
  }
  return inherit ? "" : (result.stdout || "").trim();
}

function requireAuth() {
  if (!process.env.GH_TOKEN) {
    fail("GH_TOKEN is required and must be supplied by the authorized bridge host.");
  }
}

function listCodespaces() {
  const raw = runGh([
    "codespace",
    "list",
    "--repo",
    ALLOWED_REPO,
    "--limit",
    "100",
    "--json",
    "name,state,repository,gitStatus,displayName,idleTimeoutMinutes",
  ]);
  const rows = raw ? JSON.parse(raw) : [];
  return rows.map((row) => ({
    name: row.name,
    state: row.state,
    repository: row.repository,
    branch: row.gitStatus?.ref || null,
    displayName: row.displayName || null,
    idleTimeoutMinutes: row.idleTimeoutMinutes ?? null,
  }));
}

function assertManagedCodespace(name) {
  if (!name || !/^[A-Za-z0-9-]+$/.test(name)) {
    throw new Error("Invalid codespace name.");
  }
  const match = listCodespaces().find((row) => row.name === name);
  if (!match) throw new Error("Codespace not found in the allowlisted repository.");
  if (match.repository && match.repository !== ALLOWED_REPO) {
    throw new Error("Codespace repository is outside the allowlist.");
  }
  if (match.branch && match.branch !== ALLOWED_BRANCH) {
    throw new Error(`Codespace branch ${match.branch} is outside the allowlist.`);
  }
  return match;
}

function createCodespace() {
  const name = runGh([
    "codespace",
    "create",
    "--repo",
    ALLOWED_REPO,
    "--branch",
    ALLOWED_BRANCH,
    "--idle-timeout",
    IDLE_TIMEOUT,
    "--display-name",
    "Hobby Corner AI development",
  ]);
  return name;
}

function startCodespace(name) {
  assertManagedCodespace(name);
  runGh(["api", "--method", "POST", `/user/codespaces/${name}/start`]);
}

function stopCodespace(name) {
  assertManagedCodespace(name);
  runGh(["codespace", "stop", "--codespace", name]);
}

function getState(name) {
  assertManagedCodespace(name);
  const raw = runGh(["api", `/user/codespaces/${name}`]);
  return JSON.parse(raw).state;
}

async function waitUntilAvailable(name, timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const state = getState(name);
    if (state === "Available") return;
    if (["Failed", "Unavailable"].includes(state)) {
      throw new Error(`Codespace entered terminal state: ${state}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error("Timed out waiting for Codespace to become Available.");
}

function fixedSafeTest(name) {
  assertManagedCodespace(name);
  return runGh(["codespace", "ssh", "--codespace", name, "node --version"]);
}

async function main() {
  requireAuth();
  const [action, name] = process.argv.slice(2);

  try {
    switch (action) {
      case "list":
        console.log(JSON.stringify({ ok: true, codespaces: listCodespaces() }, null, 2));
        return;
      case "create": {
        const created = createCodespace();
        console.log(JSON.stringify({ ok: true, created }, null, 2));
        return;
      }
      case "start":
        assertManagedCodespace(name);
        startCodespace(name);
        console.log(JSON.stringify({ ok: true, action: "start", name }));
        return;
      case "test": {
        const output = fixedSafeTest(name);
        console.log(JSON.stringify({ ok: true, action: "test", name, output }));
        return;
      }
      case "stop":
        assertManagedCodespace(name);
        stopCodespace(name);
        console.log(JSON.stringify({ ok: true, action: "stop", name }));
        return;
      case "smoke":
        assertManagedCodespace(name);
        try {
          startCodespace(name);
          await waitUntilAvailable(name);
          const output = fixedSafeTest(name);
          console.log(JSON.stringify({ ok: true, action: "smoke", name, output }));
        } finally {
          try {
            stopCodespace(name);
          } catch (cleanupError) {
            console.error(JSON.stringify({
              ok: false,
              cleanup: "stop_failed",
              name,
              error: cleanupError.message,
            }));
          }
        }
        return;
      default:
        fail("Usage: codespace-smoke.mjs list|create|start <name>|test <name>|stop <name>|smoke <name>");
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}

await main();
