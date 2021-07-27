import ClientError from "../../libraries/error/clientError";

export default class AnalyzeError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}