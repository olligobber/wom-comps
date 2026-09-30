import {
	addMonths,
	addWeeks,
	differenceInMonths,
	differenceInWeeks,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { UnreachableError } from "../utils/unreachable_error";
import { UTCDate } from "@date-fns/utc";

/**
 * Used to calculate comp index. E.g. if weekly, compIndex will be the number
 * of weeks between the start of the comp and this date.
 */
const REFERENCE_DATE = new UTCDate(2026, 0, 1, 0, 0, 0, 0);

export function getDurationInfo(
	now: Date,
	duration: "week" | "month",
): {
	startsAt: Date;
	endsAt: Date;
	compIndex: number;
} {
	switch (duration) {
		case "week": {
			const startsAt = addWeeks(startOfWeek(now, { weekStartsOn: 3 }), 1);
			const endsAt = addWeeks(startOfWeek(startsAt, { weekStartsOn: 3 }), 1);
			const compIndex = differenceInWeeks(startsAt, REFERENCE_DATE);

			return { startsAt, endsAt, compIndex };
		}
		case "month": {
			const startsAt = addMonths(startOfMonth(now), 1);
			const endsAt = addMonths(startOfMonth(startsAt), 1);
			const compIndex = differenceInMonths(startsAt, REFERENCE_DATE);

			return { startsAt, endsAt, compIndex };
		}
		default:
			throw new UnreachableError(duration);
	}
}
