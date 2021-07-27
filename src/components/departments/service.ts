import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import DepartmentError from "./error";
import InnerFuncion from "./function";
import InterfaceService from "../interface/serivce";
import logger from "../../libraries/util/logger";


/* 
  getCode01 : 학교리스트 가져오기
  getCode02 : 학과리스트 가져오기
*/
export default class Service extends InterfaceService {
  constructor(request: Request) {
    super(request, DataAccessLayer)
}

  public getCode01 = async () => {
    try {
      //학교 리스트 가져오기
      const db_result: any[] = await this.dataAccessLayer.getCode01();
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };

  public getCode02 = async () => {
    try {
      //학과 리스트 가져오기
      const db_result: any[] = await this.dataAccessLayer.getCode02(this.req_Params);
      return { result : this.util.resultToLower(db_result) }

    } catch (error) {
      return { error } ;
    }
  }

  public insertCode01 = async () => {
    try {
      //학교 추가
      if (this.adminInfo.admin_lv == '2') {
        throw new DepartmentError(this.request.ip, "0010");
      }

      const db_result: any[] = await this.dataAccessLayer.insertCode(this.req_Params, '1');
      const db_result2: any[] = await this.dataAccessLayer.getCode(this.req_Params.code_01_nm, '1');
      return { result : [{'code_01' : db_result2[0].CODE_01}] };

    } catch (error) {
      return { error } ;
    }
  }

  public insertCode02 = async () => {
    try {
      //학과 추가
      if (this.adminInfo.admin_lv == '2') {
        throw new DepartmentError(this.request.ip, "0010");
      }

      const db_result: any[] = await this.dataAccessLayer.insertCode(this.req_Params, '2');
      const db_result2: any[] = await this.dataAccessLayer.getCode(this.req_Params.code_02_nm, '2', this.req_Params.p_code);
      return { result : [{'code_02' : db_result2[0].CODE_02}]};

    } catch (error) {
      return { error } ;
    }
  }

  public duplicate_codename = async () => {
    try {
      //학교/학교 이름 중복 체크
      const db_result1: any[] = await this.dataAccessLayer.duplicate_codename(this.req_Params, '1', null);
      let code_01 : string | undefined = undefined;
      if (db_result1.length > 0) {
        code_01 = db_result1[0].CODE;
        const db_result2: any[] = await this.dataAccessLayer.duplicate_codename(this.req_Params, '2', db_result1[0].CODE);
        if (db_result2.length > 0) {
          throw new DepartmentError(this.request.ip, "0000")
        }
      }
      
      return { result : [{code_01 : code_01}] };

    } catch (error) {
      return { error } ;
    }
  }
}
