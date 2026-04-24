const LOG_PREFIX = "[HRM App]";

export const appLog = (...args: unknown[]) => {
  console.log(LOG_PREFIX, ...args);
};

export const appWarn = (...args: unknown[]) => {
  console.warn(LOG_PREFIX, ...args);
};

export const appError = (...args: unknown[]) => {
  console.error(LOG_PREFIX, ...args);
};
