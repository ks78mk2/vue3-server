import ClientError from "../../libraries/error/clientError";

export default class UserError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}