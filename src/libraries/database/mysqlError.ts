import SystemError from "../error/systemError";

export default class MySqlError extends SystemError {
  constructor(...args: any) {
    super(...args);
  }
}
