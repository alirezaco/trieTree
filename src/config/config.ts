import { load } from "ts-dotenv";

const env = load({
  NODE_ENV: {
    type: ["development" as const, "production" as const],
    default: "development",
  },
});

export const app = {
  mood: env.NODE_ENV,
};
