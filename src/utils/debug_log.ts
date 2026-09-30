export function debugLog(...args: any[]): void {
	console.log(`[${new Date().toISOString()}]`, ...args);
}
