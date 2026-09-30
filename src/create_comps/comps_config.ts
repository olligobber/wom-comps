import { Metric } from "@wise-old-man/utils";

type CompConfig = {
	getName: (opts: { metric: Metric }) => string;
	excludeRegs: boolean;
	metrics: Metric[];
};

export const COMP_CONFIGS: CompConfig[] = [
	{
		getName: () => `ROTC`,
		excludeRegs: false,
		metrics: [Metric.EHP],
	},
	{
		getName: ({ metric }) => `Combat - ${metric.toUpperCase()}`,
		excludeRegs: true,
		metrics: [
			Metric.ATTACK,
			Metric.STRENGTH,
			Metric.DEFENCE,
			Metric.RANGED,
			Metric.MAGIC,
			Metric.PRAYER,
		],
	},
	{
		getName: ({ metric }) => `Skilling - ${metric.toUpperCase()}`,
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
	},
];
