export class UnreachableError extends Error {
	constructor(value: unknown) {
		super(`Unreachable: ${JSON.stringify(value)}`);
	}
}
