import "dotenv/config";
import z from "zod";

const envSchema = z.object({
	COMP_DURATION: z.enum(["week", "month"]),
	WOM_GROUP_ID: z.coerce.number(),
	WOM_GROUP_KEY: z.string(),
	WOM_API_USER_AGENT: z.string(),
	ERROR_WEBHOOK: z.string(),
});

export const env = envSchema.parse(process.env);
