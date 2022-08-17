import util from 'util';
import 'setimmediate';
import {
  createLogger as createWinstonLogger,
  transports,
  Logger,
  format,
  addColors
} from "winston";

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

const customFormatter = ({ level, message, label, timestamp }) => {
  return `${label}|${timestamp}|${level}|${typeof message === 'string' ? message : util.inspect(message, {colors: true, depth: 15 })}`;
};

const createLogger = (proc?: string) => {
  addColors(customColors);
  const logger = createWinstonLogger({
    defaultMeta: {
     service: proc || 'zerodao'
    },
    levels: customLevels,
    transports: [new transports.Console({
      level: 'verbose',
      format: format.combine(
        format.label({ label: proc }),
	format.timestamp(),
	format.printf(customFormatter)
      )
    })]
  });

  return logger;
};

export { createLogger, Logger };
