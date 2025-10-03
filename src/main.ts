import { Plugin } from 'obsidian';
import { registerCommands } from './commands';

export default class MyPlugin extends Plugin {

  async onload() {
    // Register all plugin commands
    registerCommands(this);
  }

  onunload() { }
}
