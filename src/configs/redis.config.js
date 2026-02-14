const { getMyEnv, getMyEnvAsNumber } = require("@/utils/env.util");

module.exports = {
  redis: {
    host: getMyEnv("REDIS_HOST", "127.0.0.1"),
    port: getMyEnvAsNumber("REDIS_PORT", 6379),
    password: getMyEnv("REDIS_PASSWORD", undefined),
    db: 0,
    maxRetryAttempts: getMyEnvAsNumber("REDIS_MAX_RETRY_ATTEMPTS", 10),
    retryInitialDelayMs: getMyEnvAsNumber("REDIS_RETRY_INITIAL_DELAY", 100),
    retryMaxDelayMs: getMyEnvAsNumber("REDIS_RETRY_MAX_DELAY", 2000)
  }
};