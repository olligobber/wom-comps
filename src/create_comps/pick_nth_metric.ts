import type { Metric } from "@wise-old-man/utils";
import { checkExists } from "../utils/check_exists";

export function pickNthMetric(
	index: number,
	initialMetrics: Metric[],
	prng: () => number,
): Metric {
	if (initialMetrics.length === 0) {
		throw new Error("Metrics list empty");
	}

	if (initialMetrics.length === 1) {
		return checkExists(initialMetrics.at(0));
	}

	const bucketIndex = Math.floor(index / initialMetrics.length);
	const metrics = pickNthBucketMetrics(bucketIndex, initialMetrics, prng);

	return checkExists(metrics.at(index % metrics.length));
}

function pickNthBucketMetrics(
	bucketIndex: number,
	initialMetrics: Metric[],
	prng: () => number,
): Metric[] {
	let metrics = [...initialMetrics];
	for (let bi = 0; bi <= bucketIndex; bi++) {
		const tailMetric = checkExists(metrics.at(-1));
		do {
			metrics.sort(() => prng() - 0.5);
		} while (checkExists(metrics.at(0)) === tailMetric);
	}

	return metrics;
}
