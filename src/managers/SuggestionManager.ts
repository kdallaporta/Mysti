import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { QuickActionSuggestion, SuggestionColor, Conversation, Message } from '../types';

const COLORS: SuggestionColor[] = ['blue', 'green', 'purple', 'orange', 'indigo', 'teal'];
const ICONS = ['💡', '🔧', '📝', '🚀', '✨', '🎯'];

export class SuggestionManager {
  private _extensionContext: vscode.ExtensionContext;
  private _currentProcess: ReturnType<typeof spawn> | null = null;

  constructor(context: vscode.ExtensionContext) {
    this._extensionContext = context;
  }

  public async generateSuggestions(
    _conversation: Conversation,
    lastMessage: Message
  ): Promise<QuickActionSuggestion[]> {
    this.cancelGeneration();

    try {
      const suggestions = await this._callClaude(lastMessage.content);
      if (suggestions.length > 0) {
        return suggestions;
      }
    } catch (error) {
      console.error('[Mysti] Suggestion generation failed:', error);
    }

    return this._getFallbackSuggestions();
  }

  private async _callClaude(responseContent: string): Promise<QuickActionSuggestion[]> {
    // Shorter, more focused prompt for faster response
    const prompt = `Given this AI response, suggest 6 follow-up actions as JSON array.

Response: "${responseContent.substring(0, 1000)}"

Rules:
- Extract any numbered options or "Would you like..." choices
- Make suggestions specific to this response
- Each item: {"title": "3-5 words", "description": "8 words", "prompt": "message to send"}

Return ONLY JSON array, no other text.`;

    return new Promise((resolve, reject) => {
      const claudePath = this._findClaudeCliPath();
      console.log('[Mysti] Using Claude CLI path:', claudePath);

      // Use default model (faster)
      const args = ['--print', '--output-format', 'text'];

      this._currentProcess = spawn(claudePath, args, { stdio: ['pipe', 'pipe', 'pipe'] });

      let output = '';
      let stderr = '';

      this._currentProcess.stdin?.write(prompt);
      this._currentProcess.stdin?.end();

      this._currentProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      this._currentProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      // Increase timeout to 20 seconds for response
      const timeout = setTimeout(() => {
        console.error('[Mysti] Suggestion generation timed out after 20s');
        this._currentProcess?.kill('SIGTERM');
        reject(new Error('Timeout'));
      }, 20000);

      this._currentProcess.on('close', (code) => {
        clearTimeout(timeout);
        this._currentProcess = null;

        console.log('[Mysti] Claude exited with code:', code);
        if (stderr) {
          console.error('[Mysti] Claude stderr:', stderr);
        }

        if (code === 0 && output.trim()) {
          try {
            const jsonMatch = output.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              const suggestions: QuickActionSuggestion[] = parsed.map((item: Record<string, unknown>, i: number) => ({
                id: `suggestion-${Date.now()}-${i}`,
                title: String(item.title || 'Suggestion'),
                description: String(item.description || ''),
                message: String(item.prompt || item.title || ''),
                icon: ICONS[i % ICONS.length],
                color: COLORS[i % COLORS.length]
              }));
              console.log('[Mysti] Generated suggestions:', suggestions.map(s => s.title));
              resolve(suggestions.slice(0, 6));
              return;
            } else {
              console.error('[Mysti] No JSON array found in output:', output.substring(0, 200));
            }
          } catch (e) {
            console.error('[Mysti] Failed to parse suggestions JSON:', e);
            console.error('[Mysti] Raw output:', output.substring(0, 500));
          }
        } else {
          console.error('[Mysti] Claude failed - code:', code, 'output length:', output.length);
        }
        reject(new Error(`Failed to parse (code: ${code})`));
      });

      this._currentProcess.on('error', (err) => {
        clearTimeout(timeout);
        this._currentProcess = null;
        console.error('[Mysti] Spawn error:', err);
        reject(err);
      });
    });
  }

  private _getFallbackSuggestions(): QuickActionSuggestion[] {
    return [
      { id: '1', title: 'Show example', description: 'See a practical example', message: 'Can you show me an example?', icon: '💻', color: 'blue' },
      { id: '2', title: 'Explain more', description: 'Get more details', message: 'Can you explain this in more detail?', icon: '📖', color: 'green' },
      { id: '3', title: 'Continue', description: 'Keep going', message: 'Please continue', icon: '➡️', color: 'purple' }
    ];
  }

  public cancelGeneration(): void {
    if (this._currentProcess) {
      this._currentProcess.kill('SIGTERM');
      this._currentProcess = null;
    }
  }

  public clearSuggestionHistory(): void {
    // No-op - kept for API compatibility
  }

  private _findClaudeCliPath(): string {
    const config = vscode.workspace.getConfiguration('mysti');
    const configuredPath = config.get<string>('claudeCodePath', 'claude');

    if (configuredPath !== 'claude') {
      return configuredPath;
    }

    const homeDir = os.homedir();
    const extensionsDir = path.join(homeDir, '.vscode', 'extensions');

    try {
      if (fs.existsSync(extensionsDir)) {
        const entries = fs.readdirSync(extensionsDir);
        const claudeExtensions = entries
          .filter(e => e.startsWith('anthropic.claude-code-'))
          .sort()
          .reverse();

        for (const ext of claudeExtensions) {
          const binaryPath = path.join(extensionsDir, ext, 'resources', 'native-binary', 'claude');
          if (fs.existsSync(binaryPath)) {
            return binaryPath;
          }
        }
      }
    } catch (error) {
      console.error('[Mysti] Error searching for Claude CLI:', error);
    }

    return configuredPath;
  }
}
