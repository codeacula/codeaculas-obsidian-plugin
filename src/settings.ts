import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

/**
 * Plugin settings interface
 */
export interface PluginSettings {
  allowNetwork: boolean;
  openaiApiKey: string;
  geminiApiKey: string;
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: PluginSettings = {
  allowNetwork: false,
  openaiApiKey: '',
  geminiApiKey: '',
};

/**
 * Settings tab for the plugin
 */
export class PluginSettingsTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'AI Personality Settings' });

    // Network toggle
    new Setting(containerEl)
      .setName('Allow network requests')
      .setDesc('Enable AI personality features that make network calls to AI providers')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.allowNetwork)
        .onChange(async (value) => {
          this.plugin.settings.allowNetwork = value;
          await this.plugin.saveSettings();
        }));

    // OpenAI API Key
    new Setting(containerEl)
      .setName('OpenAI API key')
      .setDesc('Your OpenAI API key for using GPT models')
      .addText(text => text
        .setPlaceholder('sk-...')
        .setValue(this.plugin.settings.openaiApiKey)
        .onChange(async (value) => {
          this.plugin.settings.openaiApiKey = value;
          await this.plugin.saveSettings();
        }));

    // Gemini API Key
    new Setting(containerEl)
      .setName('Gemini API key')
      .setDesc('Your Google Gemini API key for using Gemini models')
      .addText(text => text
        .setPlaceholder('AIza...')
        .setValue(this.plugin.settings.geminiApiKey)
        .onChange(async (value) => {
          this.plugin.settings.geminiApiKey = value;
          await this.plugin.saveSettings();
        }));
  }
}
