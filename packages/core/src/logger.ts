import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
  // Quiet by default so the engine never spams CLI/consumer output; set
  // LOG_LEVEL=info or debug for verbose generation logs.
  level: process.env.LOG_LEVEL || 'warn',
});

export default logger;
