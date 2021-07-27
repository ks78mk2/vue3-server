const path = require("path");
const moment = require("moment");
const fecha = require("fecha");
const { createLogger, format } = require('winston');
let { combine, timestamp }: any = format;
const winstonDaily = require('winston-daily-rotate-file');
const server = require("../../../config/server.json");
console.log(__dirname);
const logPath = server.mode === 'develop'? path.join(__dirname, '../../../../log') : "/LCS/APP/LOG/WEBAPP/"
console.log(logPath);

const myFormat = format.printf(({ level, message, timestamp }: any) => {
  return `${timestamp} ${level}: ${message}`;
});

timestamp = format((info: any, opts: any = {}) => {
  if (opts.format) {
    info.timestamp = typeof opts.format === "function"
      ? opts.format()
      : fecha.format(moment(), opts.format);
  }

  if (!info.timestamp) {
    info.timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS").replace(/T/, " ").replace(/\+.+/, "");
  }

  if (opts.alias) {
    info[opts.alias] = info.timestamp;
  }

  return info;
});

const logger = createLogger({
  format: combine(
    timestamp(moment().format('YYYY-MM-DD HH:mm:ss.SSS')),
    myFormat,
  ),

  transports: [
    new (winstonDaily)({
          name: 'dailyInfoLog',
          level: 'info',
          filename: `${logPath}/daily-%DATE%.log`,
          datePattern: 'YYYYMMDD',
          json: false,
          maxFiles: 60
      })
  ]
});

logger.info('logger init!');

export default logger;