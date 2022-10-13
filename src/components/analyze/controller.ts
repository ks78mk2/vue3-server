import { Request, Response } from "express";
import Service from "./service";
import ReportError from "./error";
import InterfaceController from "../interface/controller"
import logger from "../../libraries/util/logger";
const fs = require('fs');


export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public getAnalyzeCount = async () => {
    const { result, error }: any = await this.service.getAnalyzeCount();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public getAnalyzeList = async () => {
    const { result, error }: any = await this.service.getAnalyzeList();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
}
