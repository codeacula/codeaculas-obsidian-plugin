import { MarkdownView } from 'obsidian';
import { processNote } from './processNote';
import { registerAICommands } from './ai';
import MyPlugin from '../main';

/**
 * Registers all plugin commands
 */
export function registerCommands(plugin: MyPlugin): void {
  plugin.addCommand({
    id: 'process-note',
    name: 'Process Note',
    checkCallback: (checking: boolean) => {
      const markdownView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
      if (!markdownView) {
        return false;
      }

      if (!checking) {
        processNote(plugin.app, markdownView.file);
      }
      return true;
    }
  });

  // Register AI commands
  registerAICommands(plugin);
}
