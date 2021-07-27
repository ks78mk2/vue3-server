import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public getOnlineList = async () => {
    const { result, error }: any = await this.service.getOnlineList();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
}
