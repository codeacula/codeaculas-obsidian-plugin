import { Plugin } from 'obsidian';
import { registerCommands } from './commands';
import { PluginSettings, DEFAULT_SETTINGS, PluginSettingsTab } from './settings';

export default class MyPlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    // Load settings
    await this.loadSettings();

    // Register all plugin commands
    registerCommands(this);

    // Add settings tab
    this.addSettingTab(new PluginSettingsTab(this.app, this));
  }

  onunload() { }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
