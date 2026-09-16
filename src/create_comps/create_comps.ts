import { WOMClient } from "@wise-old-man/utils";
import seedrandom from "seedrandom";
import { env } from "../env";
import { UTCDate } from "@date-fns/utc";
import { pickNthMetric } from "./pick_nth_metric";
import { COMP_CONFIGS } from "./comps_config";
import { getDurationInfo } from "./get_duration_info";
import { formatISO } from "date-fns";
import { debugLog } from "../utils/debug_log";
import { retryAsync } from "../utils/retry";

const womClient = new WOMClient({
  userAgent: env.WOM_API_USER_AGENT,
});

async function main() {
  try {
    debugLog("Duration:", env.COMP_DURATION);

    const { startsAt, endsAt, compIndex } = getDurationInfo(
      new UTCDate(),
      env.COMP_DURATION,
    );

    debugLog("Start:", formatISO(startsAt));
    debugLog("End:", formatISO(endsAt));

    for (const compConfig of COMP_CONFIGS) {
      const metric = pickNthMetric(
        compIndex,
        compConfig.metrics,
        seedrandom(env.WOM_GROUP_ID.toString()),
      );

      const title = compConfig.getName({ metric });

      debugLog("");
      debugLog(`Creating comp for '${title}'...`);

      const {
        competition: { id: competitionId, participations },
      } = await retryAsync("Create Competition", async () => {
        const ret = await womClient.competitions.createCompetition({
          title,
          metric,
          startsAt,
          endsAt,
          groupId: env.WOM_GROUP_ID,
          groupVerificationCode: env.WOM_GROUP_KEY,
          teams: [],
        });
        if (ret == null) {
          throw new Error("WOM returned " + JSON.stringify(ret))
        }
        return ret;
      });

      debugLog(`Done! Competition ID: ${competitionId}`);

      if (compConfig.excludeRegs) {
        debugLog("Excluding regs...");
        const irons = participations
          .filter(({ player }) => player.type !== "regular")
          .map(({ player }) => player.username);

        await retryAsync("Exclude Regs", async () => {
          const ret = await womClient.competitions.editCompetition(
            competitionId,
            { participants: irons },
            env.WOM_GROUP_KEY,
          )
          if (ret == null) {
            throw new Error("Wom returned " + JSON.stringify(ret))
          }
          return ret;
        });

        debugLog(
          `Done! Old count: ${participations.length}, new count: ${irons.length}`,
        );
      }
    }
  } catch (error) {
    await retryAsync(
      "Report Error",
      async () => {
        const response = await fetch(
          env.ERROR_WEBHOOK,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content:
                '# Something went wrong automatically creating competitions!\n```\n' +
                JSON.stringify(error, Object.getOwnPropertyNames(error), '\n') +
                '\n```',
            }),
          }
        )
        if (!response.ok) {
          throw new Error('Response status: ' + response.status)
        }
      },
      20, // Bit under a week
    )
    throw error
  }
}

main();
