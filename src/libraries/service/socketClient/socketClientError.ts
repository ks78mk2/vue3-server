import SystemError from "../../error/systemError";

export default class SocketClientError extends SystemError {
  constructor(...args: any) {
    super(...args);
  }
}