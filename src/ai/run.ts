import { App, TFile, Editor, Notice } from 'obsidian';
import { parseAIConfig, validateApiKey } from './config';
import { extractPromptBody, getSelectedText, buildMessages } from './prompt';
import { AIProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

/**
 * Registry of available AI providers
 */
const PROVIDERS: Record<string, AIProvider> = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
};

/**
 * Executes an AI personality and inserts the response below the cursor
 * @param personalityFile The AI personality note file
 * @param app Obsidian app instance
 * @param editor Active editor instance
 * @param openaiKey OpenAI API key from settings
 * @param geminiKey Gemini API key from settings
 * @param allowNetwork Whether network calls are allowed
 */
export async function runAIPersonality(
  personalityFile: TFile,
  app: App,
  editor: Editor,
  openaiKey: string,
  geminiKey: string,
  allowNetwork: boolean
): Promise<void> {
  // Check if network calls are allowed
  if (!allowNetwork) {
    new Notice('Network calls are disabled. Enable in plugin settings.');
    return;
  }

  try {
    // Parse frontmatter
    const cache = app.metadataCache.getFileCache(personalityFile);
    const frontmatter = cache?.frontmatter;
    
    if (!frontmatter) {
      new Notice('No frontmatter found in personality note');
      return;
    }

    // Parse and validate configuration
    const config = parseAIConfig(frontmatter);
    
    // Validate API key
    const apiKey = validateApiKey(config.provider, openaiKey, geminiKey);
    
    // Get the provider
    const provider = PROVIDERS[config.provider];
    if (!provider) {
      new Notice(`Unknown provider: ${config.provider}`);
      return;
    }

    // Extract prompt body from personality note
    const promptBody = await extractPromptBody(personalityFile, app);
    
    // Get user input (selected text or show notice if nothing selected)
    const selectedText = getSelectedText(app);
    if (!selectedText) {
      new Notice('Please select some text to process');
      return;
    }

    // Build messages
    const messages = buildMessages(promptBody, selectedText);
    
    // Map config to generation params
    const params = provider.mapConfig(config);
    
    // Show loading notice
    new Notice('Processing with AI...');
    
    // Get cursor position to insert response
    const cursor = editor.getCursor();
    
    // Move cursor to end of selection
    const selection = editor.getSelection();
    if (selection) {
      const cursorEnd = editor.getCursor('to');
      editor.setCursor(cursorEnd);
    }
    
    // Insert newlines and prepare for response
    editor.replaceRange('\n\n', editor.getCursor());
    const insertPos = editor.getCursor();
    
    // Call the provider
    const result = provider.send(messages, params, apiKey);
    
    if (config.stream && Symbol.asyncIterator in result) {
      // Handle streaming response
      let accumulatedText = '';
      
      for await (const chunk of result as AsyncIterable<string>) {
        accumulatedText += chunk;
        // Replace the content at insert position
        editor.replaceRange(accumulatedText, insertPos);
      }
      
      new Notice('AI response complete');
    } else {
      // Handle non-streaming response
      const response = await (result as Promise<string>);
      editor.replaceRange(response, insertPos);
      new Notice('AI response complete');
    }
    
  } catch (error) {
    console.error('AI execution error:', error);
    new Notice(`AI error: ${error instanceof Error ? error.message : String(error)}`);
  }
}
