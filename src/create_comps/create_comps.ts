import { WOMClient } from "@wise-old-man/utils";
import { env } from "../env";
import { UTCDate } from "@date-fns/utc";
import { competitions } from "./comps_config";
import { getDurationInfo } from "./get_duration_info";
import { formatISO } from "date-fns";
import { debugLog } from "../utils/debug_log";
import { retryAsync } from "../utils/retry";
import { checkExists } from "../utils/check_exists";

async function main() {
	try {
		const womClient = new WOMClient({
			userAgent: env.WOM_API_USER_AGENT,
		});

		debugLog("Duration:", env.COMP_DURATION);

		const { startsAt, endsAt, compIndex } = getDurationInfo(
			new UTCDate(),
			env.COMP_DURATION,
		);

		debugLog("Start:", formatISO(startsAt));
		debugLog("End:", formatISO(endsAt));

		for (const competition of competitions) {
			competition.create({
				compIndex,
				seed: env.WOM_GROUP_ID.toString(),
				logger: debugLog,
				creator: async (title, metric) => {
					let response = await
						checkExists(womClient.competitions.createCompetition({
							title,
							metric,
							startsAt,
							endsAt,
							groupId: env.WOM_GROUP_ID,
							groupVerificationCode: env.WOM_GROUP_KEY,
							teams: [],
						}))
					return response.competition
				},
				editor: async (competitionId, participants) => {
					checkExists(womClient.competitions.editCompetition(
						competitionId,
						{ participants },
						env.WOM_GROUP_KEY,
					))
				}
			})
		}
	} catch (error) {
		const body = [
			'# Something went wrong automatically creating competitions!',
			'```',
			JSON.stringify(error, Object.getOwnPropertyNames(error), '\n'),
			'```',
		].join("\n")

		retryAsync(
			"Report Error",
			async () => {
				const response = await fetch(
					env.ERROR_WEBHOOK,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body
					}
				)
				if (!response.ok) {
					throw new Error('Response status: ' + response.status)
				}
			},
			20, // Bit under a week
		)
	}
}

main();
