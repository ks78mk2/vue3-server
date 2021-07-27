import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"
import logger from "../../libraries/util/logger";

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public bookmarkInsert = async () => {
    const { result, error }: any = await this.service.bookmarkInsert();
    if (error) {
      logger.info('bookmarkadd statusCode : 400 | result code: '+ error.code + ' |  message: '+ error.message);
      this.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: error.message });
    } else {
      logger.info('bookmarkadd statusCode : 200 | result code: '+ result.RESULT_CODE + '|  message: ' + result.RESULT_MESSAGE);
      this.response.json(result);
    }
  };

  public hideBookmark = async () => {
    const { result, error }: any = await this.service.hideBookmark();
    if (error) {
      logger.info('bookmarkdel statusCode : 400 | result code: '+ error.code + ' |  message: '+ error.message);
      this.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: error.message });
    } else {
      logger.info('bookmarkdel statusCode : 200 | result code: '+ result.RESULT_CODE + '|  message: ' + result.RESULT_MESSAGE);
      this.response.json(result);
    }
  };

  public getBookmarkList = async () => {
    const { result, error }: any = await this.service.getBookmarkList();
    if (error) {
      logger.info('bookmarklist statusCode : 400 | result code: '+ error.code + ' |  message: '+ error.message);
      this.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: error.message });
    } else {
      for (let item in result) { 
        logger.info("key :" + item +" | value :" + result[item]);
        if(item == "LIST") {
          for (let item2 of result['LIST']) {
            let logg = ``;
            for (let item3 in item2) {
              logg += "key :" + item3 +" | value :" + item2[item3] +"   |";
            }            
            logger.info(logg);
          }
        }        
      }
      this.response.json(result);
    }
  };
}
