import { Request, Response } from "express";
import Service from "./service";
import ReportError from "./error";
import InterfaceController from "../interface/controller"
import logger from "../../libraries/util/logger";
import Util from "../../libraries/util/util"
const fs = require('fs');


export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public getReportList = async () => {
    const { result, error, typeExcel}: any = await this.service.getReportList();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);  
    }
  };

  public analyzeExcelDownload = async () => {
    const { result, error}: any = await this.service.analyzeExcelDownload();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      let that = this;
      fs.exists(result, function (exists: boolean) {
        if (!exists) {
          let error : any  = new ReportError(that.request.ip, "0002");
          that.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
          that.response.download(result);
        }        
      });
    }
  };
  public studentExcelDownload = async () => {
    const { result, error}: any = await this.service.studentExcelDownload();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      let that = this;
      fs.exists(result, function (exists: boolean) {
        if (!exists) {
          let error : any  = new ReportError(that.request.ip, "0002");
          that.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
          that.response.download(result);
        }        
      });
    }
  };

  // public getReportCount = async () => {
  //   const { result, error }: any = await this.service.getReportCount();
  //   if (error) {
  //     this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
  //   } else {
  //     this.response.json(result);
  //   }
  // };

  public mediaDownload = async () => {
    const { result, error }: any = await this.service.mediaDownload();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      let that = this;
      logger.info("file path: "+ result.path)
      fs.exists(result.path, function (exists: boolean) {
        if (!exists) {
          let error : any  = new ReportError(that.request.ip, "0002");
          that.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
          let file_rename = result.file_nm;
          that.response.writeHead(200, {'Content-disposition': 'attachment; filename=' + Util.getDownloadFilename(that.request, file_rename)});
          const inStream = fs.createReadStream(result.path);
          inStream.pipe(that.response);                 
        }        
      });      
    }
  };
}