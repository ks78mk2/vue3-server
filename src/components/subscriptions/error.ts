import ClientError from "../../libraries/error/clientError";

export default class SubError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}