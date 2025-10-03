/**
 * Gets the current year and month in the format YYYY/MM
 * @returns A string representing the current year and month (e.g., "2025/10")
 */
export function getCurrentYearMonth(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	return `${year}/${month}`;
}

/**
 * Constructs the target path for a file based on its current location
 * and the year/month subfolder structure.
 * @param currentPath The current path of the file
 * @returns The new path with year/month folder structure
 */
export function getTargetPath(currentPath: string): string {
	const yearMonth = getCurrentYearMonth();
	const fileName = currentPath.split('/').pop() || currentPath;
	const parentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
	
	// If file is at root (no parent directory), use relative path
	if (!parentDir) {
		return `${yearMonth}/${fileName}`;
	}
	
	// Otherwise, append year/month to the parent directory
	return `${parentDir}/${yearMonth}/${fileName}`;
}
