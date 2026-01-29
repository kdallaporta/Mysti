# Internet and API Endpoints

This document lists all internet and API endpoints accessed by the Mysti extension, categorized by their purpose.

## Telemetry
*   `https://dc.services.visualstudio.com` (and regional variants): **Azure Application Insights**. Used by `@vscode/extension-telemetry` to send anonymous usage data (activation, message counts, errors) for improving the extension.

## Updates & Installation
*   `https://registry.npmjs.org`: **npm Registry**. Accessed by the extension's `SetupManager` to install AI provider CLI tools (`@anthropic-ai/claude-code`, `@openai/codex`, `@google/gemini-cli`, `@github/copilot`) via `npm install -g`.

## AI Providers (CLI Tools)
The extension spawns CLI tools that communicate with their respective AI provider APIs.

### Claude (Anthropic)
*   `https://api.anthropic.com`: **Anthropic API**. Accessed by the `claude` CLI for chat completions and authentication.

### OpenAI Codex
*   `https://api.openai.com`: **OpenAI API**. Accessed by the `codex` CLI for chat completions.
*   `https://platform.openai.com`: **OpenAI Platform**. Documentation and authentication flows.

### Google Gemini
*   `https://generativelanguage.googleapis.com`: **Google Generative AI API**. Accessed by the `gemini` CLI for chat completions.
*   `https://accounts.google.com`: **Google Accounts**. Authentication for the Gemini CLI.

### GitHub Copilot
*   `https://api.github.com`: **GitHub API**. Accessed by the `copilot` CLI for GitHub integration and authentication.
*   `https://copilot-proxy.githubusercontent.com`: **Copilot API**. Primary endpoint for AI code completions.
*   `https://github.com`: **GitHub**. Authentication flows (`/login/device/code`).

## Agent Plugin Syncing
*   `https://api.github.com`: **GitHub API**. Accessed by `scripts/sync-agents.js` to fetch directory contents from the `wshobson/agents` repository.
*   `https://raw.githubusercontent.com`: **GitHub Raw Content**. Accessed by `scripts/sync-agents.js` to download agent plugin files (`.md`).

## Documentation & Links
These URLs appear in the extension for user navigation or information.

*   `https://deepmyst.com`: **DeepMyst Website**. Homepage link in `package.json` and "About" section.
*   `https://github.com/DeepMyst/Mysti`: **Mysti Repository**. Repository link.
*   `https://github.com/DeepMyst/Mysti/issues`: **Issue Tracker**. Bug reporting link.
*   `https://nodejs.org`: **Node.js Website**. Linked in the setup wizard for users who need to install Node.js.
*   `https://www.linkedin.com`: **LinkedIn**. Company link in "About" section.
*   `https://docs.anthropic.com`: **Anthropic Docs**. Documentation link for Claude Code setup.

## Internal Communication
*   `http://localhost:{MYSTI_PERMISSION_PORT}`: **Local Permission Server**. Used for local communication between the spawned `claude` CLI (via MCP) and the VS Code extension to handle permission prompts. This is not an internet endpoint.
