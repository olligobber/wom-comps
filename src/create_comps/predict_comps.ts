import seedrandom from "seedrandom";
import { env } from "../env";
import { UTCDate } from "@date-fns/utc";
import { addWeeks } from "date-fns";
import { pickNthMetric } from "./pick_nth_metric";
import { COMP_CONFIGS } from "./comps_config";
import { getDurationInfo } from "./get_duration_info";
import { formatISO } from "date-fns";
import { debugLog } from "../utils/debug_log";

async function main() {
	debugLog("Duration:", env.COMP_DURATION);

	for (var i = -2; i <= 2; i++) {
		const { startsAt, endsAt, compIndex } = getDurationInfo(
			addWeeks(new UTCDate(), i),
			env.COMP_DURATION,
		);

		debugLog("Start:", formatISO(startsAt));
		debugLog("End:", formatISO(startsAt));

		for (const compConfig of COMP_CONFIGS) {
			const metric = pickNthMetric(
				compIndex,
				compConfig.metrics,
				seedrandom(env.WOM_GROUP_ID.toString()),
			);

			debugLog(metric);
		}

		debugLog("---");
	}
}

main();
