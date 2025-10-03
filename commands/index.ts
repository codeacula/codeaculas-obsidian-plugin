import { Plugin, MarkdownView } from 'obsidian';
import { processNote } from './processNote';

/**
 * Registers all plugin commands
 */
export function registerCommands(plugin: Plugin): void {
	plugin.addCommand({
		id: 'process-note',
		name: 'Process note',
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
}
