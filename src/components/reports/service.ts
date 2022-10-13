import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import ReportError from "./error";
import InnerFuncion from "./function";
import InterfaceService from "../interface/serivce";
import { unlinkSync } from "fs";
import logger from "../../libraries/util/logger";


/* 
  getReportList : 채널 방송이력 리스트 가져오기
  getReportCount : 채널 방송이력 count
*/
export default class Service extends InterfaceService {
  constructor(request: Request) {
    super(request, DataAccessLayer)
}
  public getReportList = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getReportList(this.req_Params); // 10개단위 이력 조회

      let typeExcel : string | undefined = this.req_Params.excel;
        return {result : this.util.resultToLower(db_result), typeExcel: typeExcel};

    } catch (error) {
      return { error } ;
    }
  };

  public analyzeExcelDownload = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getReportList(this.req_Params); // 10개단위 이력 조회

      if (db_result.length == 0) {
        throw new ReportError(this.request.ip, "0004")
      }
      const control_info : any[] = await this.dataAccessLayer.getControlInfo(this.req_Params.code_id)
      let result : any = await InnerFuncion.getExcelRes(db_result, '1', 'analyze', control_info[0]);

      let analyzeImgPath : string = __dirname + '/../../../../public/excel/analyzeCapture.jpg'
      unlinkSync(analyzeImgPath) // 기존 파일 삭제
      return { result : result};

    } catch (error) {
      if (error == '0003') {
        return { error : new ReportError(this.request.ip, "0003") }
      }
      return { error } ;
    }
  };

  public studentExcelDownload = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getReportList(this.req_Params); // 10개단위 이력 조회

      if (db_result.length == 0) {
        throw new ReportError(this.request.ip, "0004")
      }
      const control_info : any[] = await this.dataAccessLayer.getControlInfo(this.req_Params.code_id)
      let result : any = await InnerFuncion.getExcelRes(db_result, '1', 'student', control_info[0]);
      return { result : result};

    } catch (error) {
      if (error == '0003') {
        return { error : new ReportError(this.request.ip, "0003") }
      }
      return { error } ;
    }
  };


  public mediaDownload = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getControlInfo(this.req_Params.code_id); // 10개단위 이력 조회
      if (db_result.length == 0) {
        throw new ReportError(this.request.ip, "0004");
      }
      if (db_result[0].ZIP_FILE == null || db_result[0].ZIP_FILE == undefined) {
        throw new ReportError(this.request.ip, "0002");
      }
      const path : string = db_result[0].ZIP_FILE;
      let file_nm : string = `LiveSeeYou_${db_result[0].CODE_01_NM}_${db_result[0].CTL_NM}_${db_result[0].START_TIME.slice(0, db_result[0].START_TIME.length -2)}_전체데이터.zip`
      return { result : {path: path, file_nm: file_nm} }

    } catch (error) {
      return { error } ;
    }
  }
}
