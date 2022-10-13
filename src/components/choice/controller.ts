import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"
import logger from "../../libraries/util/logger";

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public postViewChoice = async () => {
    const { result, error }: any = await this.service.postViewChoice();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: error.message });
    } else {
      this.response.json(result);
    }
  };
}
