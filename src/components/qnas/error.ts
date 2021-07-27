import ClientError from "../../libraries/error/clientError";

export default class QNAError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}