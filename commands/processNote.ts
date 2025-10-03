import { Notice, TFile } from 'obsidian';
import { updateProcessedFrontmatter } from '../utils/frontmatter';
import { getTargetPath } from '../utils/path';

/**
 * Processes the current note by:
 * 1. Setting the 'processed' frontmatter to the current datetime
 * 2. Moving the note to a relative folder using the current year and month
 */
export async function processNote(app: any, file: TFile | null): Promise<void> {
	if (!file) {
		new Notice('No active file to process');
		return;
	}

	try {
		// Update the frontmatter with the processed timestamp
		await updateProcessedFrontmatter(file, app);

		// Calculate the target path
		const targetPath = getTargetPath(file.path);

		// Only move if the target path is different from current path
		if (targetPath === file.path) {
			new Notice('Note processed (already in target location)');
			return;
		}

		// Ensure the target directory exists
		const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/'));
		const folder = app.vault.getAbstractFileByPath(targetDir);
		
		if (!folder) {
			await app.vault.createFolder(targetDir);
		}

		// Move the file using renameFile which automatically updates backlinks
		await app.fileManager.renameFile(file, targetPath);
		new Notice(`Note processed and moved to ${targetPath}`);
	} catch (error) {
		console.error('Error processing note:', error);
		new Notice(`Failed to process note: ${error.message}`);
	}
}
