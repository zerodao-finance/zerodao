import {
  createLogger as createWinstonLogger,
  transports,
  Logger,
  format,
  addColors
} from "winston";
import { UserTypes } from "./types";

const customLevels = {
  error: 0,
  warn: 1,
  data: 2,
  info: 3,
  debug: 4,
  verbose: 5,
  silly: 6,
  custom: 7,
};

const customColors = {
  error: 'red',
  warn: 'yellow',
  data: 'grey',
  info: 'green',
  debug: 'red',
  verbose: 'cyan',
  silly: 'magenta',
  custom: 'blue',
}

const createLogger = (userType?: UserTypes) => {
  addColors(customColors);
  const logger = createWinstonLogger({
    defaultMeta: {
      service: userType ?? "zero.user",
    },
    levels: customLevels,
    transports: [new transports.Console({
      level: 'custom',
      format: format.combine(
        format.colorize({
          all:true,
        }),
        format.splat(),
        format.simple(),
      )
      })],
  });

  return logger;
};

export { createLogger, Logger };
