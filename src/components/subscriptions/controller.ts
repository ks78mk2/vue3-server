import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }
  public getSubscriptionList = async () => {
    const { result, error }: any = await this.service.getSubscriptionList();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public subInsertData = async () => {
    const { result, error }: any = await this.service.subInsertData();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
  
  public getSubscriptionCount = async () => {
    const { result, error }: any = await this.service.getSubscriptionCount();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public getAdminInfo = async () => {
    const { result, error }: any = await this.service.getAdminInfo();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
}
