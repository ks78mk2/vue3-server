import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import CommonError from "./error";
import InnerFuncion from "./function";
import interfaceSerivce from "../interface/serivce";
import logger from "../../libraries/util/logger";
const fs = require('fs');
/* 

*/
export default class Service extends interfaceSerivce {
  constructor(request: Request) {
    super(request, DataAccessLayer)
}

  public getThumb = async () => {
    try {
      let path : string = '';
      if ((this.req_Params.img != '')) {
        let file_nm : string = this.req_Params.img;
        file_nm = file_nm.split("../").join("");
        path = file_nm;
      } else {
        throw new CommonError(this.request.ip, '0000')
      }
      return {result : path}
    } catch (error) {
      return { error } ;
    }
  };

  public logoDownload = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getLogoFileName(this.req_Params);
      if (db_result.length == 0) {
        throw new CommonError(this.request.ip, "0001");
      }
      let path : string = `/DATA1/VCS/logo/${db_result[0].CODE_NM}`;      
      return {result : path}
    } catch (error) {
      return { error } ;
    }
  };

  public getLiveviewAddress = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getLiveviewAddress();
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  }

  public vodDownload = async () => {
    try {
      const pathName: any[] = await this.dataAccessLayer.getVodDownloadPath();
      const db_result: any[] = await this.dataAccessLayer.getVodFileName(this.req_Params);
      
      if (db_result.length == 0) {
        throw new CommonError(this.request.ip, '0000')
      }

      let path : string = pathName[0].PATH + '/' + db_result[0].UPLOAD_FILE_NM;
      let file_nm : string = `LiveSeeYou_${db_result[0].CODE_01_NM}_${db_result[0].SUBJECT}_${db_result[0].START_TIME.slice(0, db_result[0].START_TIME.length -2)}_${db_result[0].ADMIN_ID}_${db_result[0].CUST_NM}_${db_result[0].INSERT_DATE}.mp4`
      return {result : {path: path, file_nm: file_nm}}
    } catch (error) {
      return { error } ;
    }
  };

  public appDownload = async () => {
    try {
      let type: string = this.req_Params.type;
      const db_result: any[] = await this.dataAccessLayer.appDownload();
      let path : string = db_result[0].APK_DIR;
      if (type == '1') {
        path += "/iLiveView-setup.msi"
      } else if (type == '2') {
        path += "/liveseeu_andriod.apk"
      }             
      return {result : {path: path, type: type}}
    } catch (error) {
      return { error } ;
    }
  };

  public uploadFile = async () => {
    let that = this;
    return new Promise(async function(resolve: any, reject: any) {
      try {
        const db_result: any[] = await that.dataAccessLayer.getUploadDiretory(that.req_Params.device_id);
        if (db_result.length == 0) {
          let deviceError = new CommonError(that.request.ip, "0011")
          deviceError.code = "0001"
          resolve({ error: deviceError});
        } else {
          let oldPath : string = __dirname + '/../../../../public/uploads/' + that.request.file.originalname;
          let newPath : string = '/DATA1/VCS/thumbnail/' + db_result[0].UPLOAD_FILE_NM + '/' + that.request.file.originalname;
          let directory : string = '/DATA1/VCS/thumbnail/' + db_result[0].UPLOAD_FILE_NM ;
    
          // if (!existsSync(directory)) mkdirSync(directory); //폴더가 없을 경우 생성        
          fs.exists(directory, async function (exists :boolean) {
            try {
              if (!exists) {
                logger.info("test1 :" + exists)
                throw {statusCode: 400, code: "0002", message: "폴더 없음"} 
              } else {          
                await InnerFuncion.moveFile(oldPath, newPath ,that.request.ip)
                await that.dataAccessLayer.updateThumbName(that.req_Params.device_id, that.req_Params.step, newPath);
                await that.dataAccessLayer.updateThumbName2(that.req_Params.device_id, newPath);
                resolve({result : "업로드 성공"})
              }
            } catch(error) {
              logger.info("test2 :" + error)
              resolve({ error }) ;
            }          
          }) 
        }
      } catch (error) {
        logger.info("test3 :" + error)
        resolve({ error }) ;
      }
    })    
  };

  public sendmail = async () => {
    try {
      let mailOptions : any = {};
      if (this.req_Params.type == 'question') {
        mailOptions = { 
          from: 'admin@liveseeyou.com',
          to: this.req_Params.to,
          subject: '고객문의',
          html: this.req_Params.html,
        }
      } else if (this.req_Params.type == 'opening') {
        mailOptions = { 
          from: 'admin@liveseeyou.com',
          to: this.req_Params.to,
          subject: this.req_Params.subject,
          html: this.req_Params.html,
        }
      } else {
        throw new CommonError(this.request.ip, "0002")
      }
      logger.info("from :"+ mailOptions.from)
      logger.info("to :"+ mailOptions.to)
      logger.info("subject :"+ mailOptions.subject)
      logger.info("html :"+ mailOptions.html)
      let result : any = await InnerFuncion.sendmail(mailOptions, this.request.ip);
      return { result : result }
      
    } catch (error) {
      return { error } ;
    }
  };
}
