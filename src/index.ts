/**
 * @seomcp/proxy — Main entry point
 *
 * Local MCP proxy that reads Google service account credentials from disk
 * and forwards MCP tool calls to api.seomcp.dev over HTTPS.
 *
 * Usage:
 *   seomcp-proxy              Run as MCP server (stdio mode)
 *   seomcp-proxy test         Validate credentials, API key, connectivity
 *   seomcp-proxy version      Print version
 *   seomcp-proxy --help       Print help
 *
 * @license MIT
 */

import { VERSION } from "./version.js";
import { initManifest } from "./manifest.js";
import { startStdioServer } from "./mcp.js";
import { readCredentials, validateApiKey } from "./credentials.js";
import { healthCheck, authTest } from "./client.js";

// ─── CLI Commands ────────────────────────────────────────────────────────────

const HELP = `
seomcp-proxy v${VERSION}
Local MCP proxy for seo-mcp — forwards tool calls to api.seomcp.dev

USAGE
  seomcp-proxy              Run as MCP server (stdio mode)
  seomcp-proxy test         Validate credentials + API key + connectivity
  seomcp-proxy version      Print version
  seomcp-proxy --help       Print this help

ENVIRONMENT VARIABLES
  SEOMCP_API_KEY            (required) API key (sk_live_REDACTED format)
  GOOGLE_SERVICE_ACCOUNT    (optional) Path to Google service account JSON — required for GSC/GA4 tools
  GSC_PROPERTIES            (optional) Comma-separated domain names — required for GSC tools
  GA4_PROPERTIES            (optional) Comma-separated propertyID:domain — required for GA4 tools
  INDEXNOW_KEY              (optional) Your IndexNow API key — used by IndexNow submission tools
  SEOMCP_API_URL            (optional) Override API URL (default: https://api.seomcp.dev)
  SEOMCP_TIMEOUT            (optional) Request timeout in ms (default: 30000)

SETUP
  1. Get an API key at https://seomcp.dev/dashboard
  2. Configure your MCP client (e.g., Claude Desktop, Cursor):

     {
       "mcpServers": {
         "seo-mcp": {
           "command": "seomcp-proxy",
           "env": {
             "SEOMCP_API_KEY": "sk_live_...",
             "GOOGLE_SERVICE_ACCOUNT": "/path/to/service-account.json",
             "GSC_PROPERTIES": "example.com,blog.example.com",
             "GA4_PROPERTIES": "123:example.com,456:blog.example.com",
             "INDEXNOW_KEY": "your-indexnow-key"
           }
         }
       }
     }

  Note: Only SEOMCP_API_KEY is required. All other env vars are optional — only add what you need.

  3. Start using 38 SEO tools in your AI assistant!

DOCS
  https://seomcp.dev/docs
  https://github.com/quantacodes/seomcp-proxy
`.trim();

/**
 * `seomcp-proxy test` — validate the full chain.
 */
async function runTest(): Promise<void> {
  let allPassed = true;
  const check = (label: string, pass: boolean, detail?: string) => {
    const icon = pass ? "✅" : "❌";
    const suffix = detail ? ` — ${detail}` : "";
    console.log(`${icon} ${label}${suffix}`);
    if (!pass) allPassed = false;
  };

  console.log(`\nseomcp-proxy v${VERSION} — Connection Test\n`);

  // 1. API Key
  const apiKey = process.env.SEOMCP_API_KEY;
  const keyErr = validateApiKey(apiKey);
  check("SEOMCP_API_KEY set", !keyErr, keyErr ?? undefined);

  // 2. Service account file (optional — only needed for GSC/GA4 tools)
  const saPath = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (saPath) {
    check("GOOGLE_SERVICE_ACCOUNT set", true, saPath);
    const cred = readCredentials(saPath);
    check("Service account JSON valid", cred.ok, cred.ok ? undefined : cred.message);
  } else {
    console.log(`ℹ️  GOOGLE_SERVICE_ACCOUNT — not set (optional, required for GSC/GA4 tools)`);
  }

  // 2b. IndexNow key (optional)
  const indexnowKey = process.env.INDEXNOW_KEY;
  if (indexnowKey) {
    check("INDEXNOW_KEY set", true, `${indexnowKey.substring(0, 8)}...`);
  } else {
    console.log(`ℹ️  INDEXNOW_KEY — not set (optional, required for IndexNow tools)`);
  }

  // 4. Cloud health check
  try {
    const health = await healthCheck();
    check(
      "api.seomcp.dev reachable",
      health.ok && health.status === 200,
      health.ok ? `HTTP ${health.status}` : (health as { message?: string }).message,
    );
  } catch (err) {
    check("api.seomcp.dev reachable", false, (err as Error).message);
  }

  // 5. Auth test
  if (apiKey && !keyErr) {
    try {
      const auth = await authTest(apiKey);
      const ok = auth.ok && auth.status === 200;
      check(
        "API key valid",
        ok,
        auth.ok ? `HTTP ${auth.status}` : (auth as { message?: string }).message,
      );
    } catch (err) {
      check("API key valid", false, (err as Error).message);
    }
  } else {
    check("API key valid", false, "skipped — key not set or invalid format");
  }

  console.log(
    allPassed
      ? "\n🎉 All checks passed! Ready to proxy."
      : "\n⚠️  Some checks failed. Fix the issues above.",
  );

  process.exit(allPassed ? 0 : 1);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const arg = process.argv[2];

  switch (arg) {
    case "version":
    case "--version":
    case "-v":
      console.log(VERSION);
      process.exit(0);
      break;

    case "help":
    case "--help":
    case "-h":
      console.log(HELP);
      process.exit(0);
      break;

    case "test":
      await runTest();
      break;

    case undefined:
    case "": {
      // No argument: run as MCP stdio server
      // Initialize manifest (non-blocking, best-effort)
      const apiKey = process.env.SEOMCP_API_KEY;
      initManifest(apiKey).catch((err) => {
        process.stderr.write(
          `⚠️  Manifest fetch failed: ${(err as Error).message}\n`,
        );
      });

      // Start stdio server
      startStdioServer();
      break;
    }

    default: {
      // Unknown command — show error + help
      process.stderr.write(`Unknown command: ${arg}\n\n`);
      console.log(HELP);
      process.exit(1);
      break;
    }
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${(err as Error).message}\n`);
  process.exit(1);
});
