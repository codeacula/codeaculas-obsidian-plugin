import { App, TFile, MarkdownView } from 'obsidian';
import { AIMessage } from './types';

/**
 * Extracts the prompt body from a personality note (content after frontmatter)
 * @param file The personality note file
 * @param app Obsidian app instance
 * @returns The prompt body text
 */
export async function extractPromptBody(file: TFile, app: App): Promise<string> {
  const content = await app.vault.read(file);
  
  // Remove frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const withoutFrontmatter = content.replace(frontmatterRegex, '');
  
  return withoutFrontmatter.trim();
}

/**
 * Gets the currently selected text in the active editor
 * @param app Obsidian app instance
 * @returns Selected text or empty string if no selection
 */
export function getSelectedText(app: App): string {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) return '';
  
  const editor = view.editor;
  return editor.getSelection();
}

/**
 * Builds the message array for AI providers
 * @param promptBody The system/personality prompt from the note
 * @param userInput The user's input (selected text or current note content)
 * @returns Array of messages for the AI provider
 */
export function buildMessages(promptBody: string, userInput: string): AIMessage[] {
  const messages: AIMessage[] = [];

  // Add system message if prompt body exists
  if (promptBody) {
    messages.push({
      role: 'system',
      content: promptBody,
    });
  }

  // Add user message
  if (userInput) {
    messages.push({
      role: 'user',
      content: userInput,
    });
  }

  return messages;
}
