import ClientError from "../../libraries/error/clientError";

export default class ChoiceError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}