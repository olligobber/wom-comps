import { Metric, type CompetitionDetailsResponse } from "@wise-old-man/utils";
import { pickNthMetric } from "./pick_nth_metric";
import seedrandom from "seedrandom";
import { retryAsync } from "../utils/retry";

export class Competition {
	getName: (metric: Metric) => string;
	excludeRegs: boolean;
	metrics: Metric[];

	constructor(props: {
		getName: (metric: Metric) => string,
		excludeRegs: boolean,
		metrics: Metric[],
	}) {
		this.getName = props.getName;
		this.excludeRegs = props.excludeRegs;
		this.metrics = props.metrics;
	}

	async create(props: {
		compIndex : number,
		seed : string,
		logger : (s : string) => void,
		creator : (title: string, metric: Metric) => Promise<CompetitionDetailsResponse>,
		editor : (competitionId: number, participants: string[]) => Promise<void>
	}) {
		const metric = pickNthMetric(
			props.compIndex,
			this.metrics,
			seedrandom(props.seed),
		);

		const title = this.getName(metric);

		props.logger("");
		props.logger(`Creating comp for '${title}'...`);

		const { id: competitionId, participations } =
			await retryAsync("Create Competition", () =>
				props.creator(title, metric)
			);

		props.logger(`Done! Competition ID: ${competitionId}`);

		if (this.excludeRegs) {
			props.logger("Excluding regs...");
			const irons = participations
				.filter(({ player }) => player.type !== "regular")
				.map(({ player }) => player.username);

			await retryAsync("Exclude Regs", () =>
				props.editor(competitionId, irons)
			);

			props.logger(
				'Done! Old count: ' +
				participations.length +
				', new count: ' +
				irons.length
			);
		}
	}
}

export const competitions: Competition[] = [
	new Competition({
		getName: () => `ROTC`,
		excludeRegs: false,
		metrics: [Metric.EHP],
	}),
	new Competition({
		getName: (metric) => `Combat - ${metric.toUpperCase()}`,
		excludeRegs: true,
		metrics: [
			Metric.ATTACK,
			Metric.STRENGTH,
			Metric.DEFENCE,
			Metric.RANGED,
			Metric.MAGIC,
			Metric.PRAYER,
		],
	}),
	new Competition({
		getName: (metric) => `Skilling - ${metric.toUpperCase()}`,
		excludeRegs: true,
		metrics: [
			Metric.RUNECRAFTING,
			Metric.CRAFTING,
			Metric.MINING,
			Metric.SMITHING,
			Metric.FISHING,
			Metric.COOKING,
			Metric.FIREMAKING,
			Metric.WOODCUTTING,
		],
	}),
]