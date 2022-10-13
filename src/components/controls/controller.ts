import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public getChannelList = async () => {
    const { result, error }: any = await this.service.getChannelList();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public duplicate_time = async () => {
    const { result, error }: any = await this.service.duplicate_time();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public getChannelCount = async () => {
    const { result, error }: any = await this.service.getChannelCount();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public ControlInsertData = async () => {
    const { result, error }: any = await this.service.ControlInsertData();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
  
  public getReportChannel = async () => {
    const { result, error }: any = await this.service.getReportChannel();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public getOnlineChannel = async () => {
    const { result, error }: any = await this.service.getOnlineChannel();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public getChannelInfo = async () => {
    const { result, error }: any = await this.service.getChannelInfo();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
}
