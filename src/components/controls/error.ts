import ClientError from "../../libraries/error/clientError";

export default class ControlError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}