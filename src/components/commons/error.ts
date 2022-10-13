import ClientError from "../../libraries/error/clientError";

export default class CommonError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}