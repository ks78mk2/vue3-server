import ClientError from "../../libraries/error/clientError";

export default class OnlineError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}