import ClientError from "../../libraries/error/clientError";

export default class DepartmentError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}