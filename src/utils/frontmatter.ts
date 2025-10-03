import { App, TFile } from 'obsidian';

/**
 * Updates the frontmatter of a file by adding or updating the 'processed' field
 * with the current datetime.
 */
export async function updateProcessedFrontmatter(
  file: TFile,
  app: App
): Promise<void> {
  await app.fileManager.processFrontMatter(file, (frontmatter: any) => {
    frontmatter.processed = new Date().toISOString();
  });
}
