import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public getCode01 = async () => {
    const { result, error }: any = await this.service.getCode01();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public getCode02 = async () => {
    const { result, error }: any = await this.service.getCode02();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public insertCode01 = async () => {
    const { result, error }: any = await this.service.insertCode01();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public insertCode02 = async () => {
    const { result, error }: any = await this.service.insertCode02();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public duplicate_codename = async () => {
    const { result, error }: any = await this.service.duplicate_codename();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }
}
