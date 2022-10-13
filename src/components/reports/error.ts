import ClientError from "../../libraries/error/clientError";

export default class ReportError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}