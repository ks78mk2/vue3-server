import { Request, Response } from "express";
import Service from "./service";
import InterfaceController from "../interface/controller"
import CommonError from "./error"
import logger from "../../libraries/util/logger";
import Util from "../../libraries/util/util"
const fs = require('fs');

export default class Controller extends InterfaceController{
  constructor (request: Request, response: Response) {
    super(request, response, Service);
  }

  public thumbView = async () => {
    const { result, error }: any = await this.service.getThumb();
    let err_flag :boolean = false;
    let that = this;
    if (error) {
      err_flag = true;
      fs.readFile(__dirname + '/../../../../public/no-image.png', function( err: any, data: any) {
        that.response.end(data);
      })
    } else {
      fs.exists(result, function (exists: boolean) {
        if (!exists) {
          err_flag = true;
          fs.readFile(__dirname + '/../../../../public/no-image.png', function( err: any, data: any) {
            that.response.end(data);
          })
        } else {
          fs.readFile(result, function (err: any, data: any) {
            if (err) {
              err_flag = true;
              fs.readFile(__dirname + '/../../../../public/no-image.png', function( err: any, data: any) {
                that.response.end(data);
              })
            } else {
              that.response.end(data);
            }        
          });    
        }        
      });      
    }
  };

  public thumbDownload = async () => {
    const { result, error }: any = await this.service.getThumb();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      let that = this;
      fs.exists(result, function (exists: boolean) {
        if (!exists) {
          let error : any  = new CommonError(that.request.ip, "0001");
          that.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
          that.response.download(result);
        }        
      });
    }
  };

  public logoDownload = async () => {
    const { result, error }: any = await this.service.logoDownload();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: "다운로드 실패" });
    } else {
      let that = this;
      fs.exists(result, function (exists: boolean) {
        if (!exists) {
          let error : any  = new CommonError(that.request.ip, "0001");
          that.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: "다운로드 실패" });
        } else {
          that.response.download(result);
        }        
      });
    }
  };

  public appDownload = async () => {
    const { result, error }: any = await this.service.appDownload();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      let that = this;
      logger.info("path :"+ result.path)
      logger.info("type :"+ result.type)
      fs.exists(result.path, function (exists: boolean) {
        if (!exists) {
          let error : any  = new CommonError(that.request.ip, "0001");
          that.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
          if (result.type == '3') {
            fs.readFile(result.path, 'utf-8', function (error:any, data:any) {
              that.response.send(data)
            })            
          } else {
            that.response.download(result.path);
          }          
        }        
      });
    }
  };

  public vodDownload = async () => {
    const { result, error }: any = await this.service.vodDownload();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      let that = this;
      fs.exists(result.path, function (exists: boolean) {
        if (!exists) {
          let error : any  = new CommonError(that.request.ip, "0001");
          that.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
          // that.response.download(result);
          let file_rename = result.file_nm;
          that.response.writeHead(200, {'Content-disposition': 'attachment; filename=' + Util.getDownloadFilename(that.request, file_rename)});
          const inStream = fs.createReadStream(result.path);
          inStream.pipe(that.response);  
        }        
      });
    }
  };

  public sendmail = async () => {
    const { result, error }: any = await this.service.sendmail();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };

  public uploadFile = async () => {
    const { result, error }: any = await this.service.uploadFile();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_CODE: error.code, RESULT_MESSAGE: error.message });
    } else {
      this.response.json({ RESULT_CODE: '0000', RESULT_MESSAGE: '업로드 성공' });
    }
  };

  public getLiveviewAddress = async () => {
    const { result, error }: any = await this.service.getLiveviewAddress();
    if (error) {
      this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
    } else {
      this.response.json(result);
    }
  };
}
