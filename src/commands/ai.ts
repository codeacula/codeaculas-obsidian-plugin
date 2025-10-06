import { TFile, SuggestModal, Notice } from 'obsidian';
import MyPlugin from '../main';
import { runAIPersonality } from '../ai/run';

/**
 * Modal for selecting an AI personality note
 */
class AIPersonalitySuggestModal extends SuggestModal<TFile> {
  plugin: MyPlugin;
  onSelect: (file: TFile) => void;

  constructor(plugin: MyPlugin, onSelect: (file: TFile) => void) {
    super(plugin.app);
    this.plugin = plugin;
    this.onSelect = onSelect;
  }

  getSuggestions(query: string): TFile[] {
    const files = this.app.vault.getMarkdownFiles();
    
    // Filter for files with note-type: ai-personality
    const personalityFiles = files.filter(file => {
      const cache = this.app.metadataCache.getFileCache(file);
      return cache?.frontmatter?.['note-type'] === 'ai-personality';
    });

    // Filter by query
    if (!query) {
      return personalityFiles;
    }

    const lowerQuery = query.toLowerCase();
    return personalityFiles.filter(file =>
      file.basename.toLowerCase().includes(lowerQuery)
    );
  }

  renderSuggestion(file: TFile, el: HTMLElement): void {
    el.createEl('div', { text: file.basename });
    el.createEl('small', { text: file.path });
  }

  onChooseSuggestion(file: TFile): void {
    this.onSelect(file);
  }
}

/**
 * Last used personality for re-run command
 */
let lastPersonality: TFile | null = null;

/**
 * Registers AI-related commands
 * @param plugin Plugin instance
 */
export function registerAICommands(plugin: MyPlugin): void {
  // Command: Run AI with Personality...
  plugin.addCommand({
    id: 'run-ai-personality',
    name: 'Run AI with Personality…',
    editorCheckCallback: (checking: boolean, editor, view) => {
      if (checking) {
        return true;
      }

      new AIPersonalitySuggestModal(
        plugin,
        async (file: TFile) => {
          lastPersonality = file;
          await runAIPersonality(
            file,
            plugin.app,
            editor,
            plugin.settings.openaiApiKey,
            plugin.settings.geminiApiKey,
            plugin.settings.allowNetwork
          );
        }
      ).open();

      return true;
    }
  });

  // Command: Re-run last Personality
  plugin.addCommand({
    id: 'rerun-last-ai-personality',
    name: 'Re-run last Personality',
    editorCheckCallback: (checking: boolean, editor, view) => {
      if (checking) {
        return lastPersonality !== null;
      }

      if (lastPersonality) {
        runAIPersonality(
          lastPersonality,
          plugin.app,
          editor,
          plugin.settings.openaiApiKey,
          plugin.settings.geminiApiKey,
          plugin.settings.allowNetwork
        );
      }

      return true;
    }
  });

  // Command: Use personality referenced by current note
  plugin.addCommand({
    id: 'use-referenced-personality',
    name: 'Use personality referenced by current note',
    editorCheckCallback: (checking: boolean, editor, view) => {
      const file = view.file;
      if (!file) return false;

      const cache = plugin.app.metadataCache.getFileCache(file);
      const personalityPath = cache?.frontmatter?.personality;

      if (checking) {
        return !!personalityPath;
      }

      if (!personalityPath) {
        new Notice('No personality reference found in frontmatter');
        return false;
      }

      // Resolve the personality file
      const personalityFile = plugin.app.metadataCache.getFirstLinkpathDest(
        personalityPath,
        file.path
      );

      if (!personalityFile) {
        new Notice(`Personality file not found: ${personalityPath}`);
        return false;
      }

      lastPersonality = personalityFile;
      runAIPersonality(
        personalityFile,
        plugin.app,
        editor,
        plugin.settings.openaiApiKey,
        plugin.settings.geminiApiKey,
        plugin.settings.allowNetwork
      );

      return true;
    }
  });
}
