import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  mode: process.env.APP_MODE,
  port: Number(process.env.APP_PORT),
  apiUrl: process.env.APP_API_PREFIX,
  isProduction: process.env.APP_MODE === "prod",
  log: {
    info: process.env.APP_LOG_INFO,
    error: process.env.APP_LOG_ERROR,
    warn: process.env.APP_LOG_WARN,
    debug: process.env.APP_LOG_DEBUG,
  },
}));

export const APP_CONFIG_KEYS = {
  mode: "app.mode",
  port: "app.port",
  apiUrl: "app.apiUrl",
  isProduction: "app.isProduction",
  log: {
    info: "app.log.info",
    error: "app.log.error",
    warn: "app.log.warn",
    debug: "app.log.debug",
  },
}