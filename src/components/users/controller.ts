import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public signin = async () => {
    const { result, error }: any = await this.service.signin();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public userInsertData = async () => {
    const { result, error }: any = await this.service.userInsertData();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public userUpdateData = async () => {
    const { result, error }: any = await this.service.userUpdateData();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public signout = async () => {
    const { result, error }: any = await this.service.signout();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public passInit = async () => {
    const { result, error }: any = await this.service.passInit();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public passCheck = async () => {
    const { result, error }: any = await this.service.passCheck();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public email_existence = async () => {
    const { result, error }: any = await this.service.email_existence();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public getUserList = async () => {
    const { result, error }: any = await this.service.getUserList();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }

  public getLiveviewUser = async () => {
    const { result, error }: any = await this.service.getLiveviewUser();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  }
}
