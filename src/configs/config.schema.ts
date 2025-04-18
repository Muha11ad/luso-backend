import * as Joi from 'joi';

export const configSchema = Joi.object({
    APP_MODE: Joi.string().valid('dev', 'prod', 'test'),
    APP_PORT: Joi.number(),
    APP_API_PREFIX: Joi.string(),

    ADMIN_EMAIL: Joi.string(),
    ADMIN_PASSWORD: Joi.string(),

    ALLOWED_ORIGINS: Joi.string(),

    RATE_LIMIT_MAX: Joi.number(),

    UPLOADS_ORIGIN: Joi.string(),
    PATH_TO_UPLOADS: Joi.string(),


    DELIVERY_FEE: Joi.number(),

    DB_TYPE: Joi.string(),
    DB_CONNECTION_URL: Joi.string(),

    REDIS_HOST: Joi.string(),
    REDIS_PORT: Joi.number(),
    REDIS_PASSWORD: Joi.string(),

    JWT_ACCESS_SECRET: Joi.string(),
    JWT_REFRESH_SECRET: Joi.string(),
    JWT_ACCESS_EXPIRES: Joi.string(),
    JWT_REFRESH_EXPIRES: Joi.string(),

    AI_API_KEY: Joi.string(),
    AI_BASE_URL: Joi.string(),
    AI_MODEL: Joi.string(),

    PROXY_URL: Joi.string(),
    PROXY_USERNAME: Joi.string(),
    PROXY_PASSWORD: Joi.string(),

}).options({ presence: "required" });

