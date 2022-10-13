import SystemError from "../../error/systemError";

export default class SocketError extends SystemError {
  constructor(...args: any) {
    super(...args);
  }
}