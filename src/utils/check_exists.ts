export function checkExists<T>(value: T | null | undefined): T {
	if (value == null) {
		throw new Error("value is undefined");
	}

	return value;
}
