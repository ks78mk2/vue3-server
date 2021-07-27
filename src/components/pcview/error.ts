import ClientError from "../../libraries/error/clientError";

export default class BookmarkError extends ClientError {
  constructor(...args: any) {
    super(...args);
  }
}