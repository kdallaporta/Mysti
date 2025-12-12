# Changelog

All notable changes to the Mysti extension will be documented in this file.

## [0.2.0] - December 2025

### Added

- **Three-tier Agent Loading System**: Progressive loading for personas and skills from markdown files
  - Tier 1: Metadata (always loaded for fast UI)
  - Tier 2: Instructions (loaded on selection)
  - Tier 3: Full content with examples (loaded on demand)
- **Toolbar Persona Indicator**: Quick persona switching from the input toolbar
  - Shows active persona name
  - Click to view all personas or context-aware suggestions
- **Inline Suggestions Widget**: Compact persona recommendations above input area
  - Auto-suggests personas based on message content (enabled by default)
  - Toggle auto-suggest on/off inline
  - Dismiss button to hide suggestions
- **Optional Token Budget**: Control agent context size
  - Disabled by default (0 = unlimited)
  - Enable via settings to limit token usage for agent context
- **Google Gemini Provider**: Full Gemini CLI integration as third AI provider
  - Complete streaming support with `--output-format stream-json`
  - Configurable in brainstorm mode alongside Claude and Codex
- **VS Code Auto-Activation**: Extension activates when AI config files detected
  - Workspace triggers: `CLAUDE.md`, `gemini.yaml`, `codex.json`, `agents.yaml`
  - Directory triggers: `.mysti/`, `.claude/`, `.gemini/`, `.openai/`
- **Custom Language Definitions**: Special file type recognition
  - `.claude.md`, `.prompt.md`, `.gpt.md`, `.gemini.md`, `.codex.md`
  - Enables VS Code extension recommendations for prompt files
- **Latest AI Models**: Updated model support across providers
  - Claude: claude-sonnet-4-5-20250929
  - Codex: GPT-5.2, GPT-5.2 Thinking
  - Gemini: Gemini 3 Deep Think
- **Azure Telemetry**: Anonymous usage analytics via Application Insights

### Changed

- Auto-suggest for personas is now **enabled by default**
- Token budget default changed from 2000 to 0 (unlimited)
- Persona selection now shows inline instead of opening full agent config panel
- Welcome message updated to "Your AI coding team"
- Brainstorm agents now configurable (select any 2 of 3 providers)
- README optimized for VS Code Marketplace discovery

### New Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `mysti.agents.autoSuggest` | `true` | Auto-suggest personas based on message content |
| `mysti.agents.maxTokenBudget` | `0` | Max tokens for agent context (0 = unlimited) |
| `mysti.brainstorm.agents` | `["claude-code", "openai-codex"]` | Select which 2 agents for brainstorm |
| `mysti.geminiPath` | `gemini` | Path to Gemini CLI executable |

## [0.1.0] - December 2025

### Initial Release

- Initial release
- Multi-provider support (Claude Code CLI, OpenAI Codex CLI)
- Brainstorm mode with multi-agent collaboration
- 16 developer personas
- 12 toggleable skills
- Plan selection and execution
- Permission management system
- Persistent conversation history
- Context-aware suggestions
- Syntax highlighting with Prism.js
- Mermaid diagram support
- Theme-aware UI (light/dark)
