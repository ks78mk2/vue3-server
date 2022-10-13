import logger from "../util/logger";

export default class SystemError extends Error {
  public code: string;
  public message: string;
  public statusCode: number;
  private ip: string;

  constructor(...args: any) {
    super(...args);
    this.ip = args[0].indexOf(':') >= 0 ? args[0].substring(args[0].lastIndexOf(':') + 1) : args[0];
    this.code = args[1];
    this.statusCode = args[2] || 400;
    this.message = this.getErrorMessage(this.constructor.name);
  }

  public getErrorMessage(componentName: string) {
    const errMsg: any = {
      "SystemError": {
        "0000": "contructor parameters is required",
        "0001": "rtmp url has no value in common table",
        "0002": "overflow",
        "9999": "System error"
      },
      "MySqlError": {
        "0000": "mysql connection failed.",
        "0001": "mysql query error.",
        "0002": "mysql error [ER_DUP_ENTRY]"
      },
      "SocketError" : {
        
      },
      "SocketClientError" : {

      }
    };

    if (errMsg[componentName][this.code] === undefined) {
      logger.error(`[${this.ip}] -> ${componentName} : unknown error`);
      return "system error";
    } else {
      logger.error(`[${this.ip}] -> ${componentName} : ${errMsg[componentName][this.code]}`);
      return errMsg[componentName][this.code];
    }
  }
}
