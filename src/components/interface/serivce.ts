/* 
 공통 service
 각 service 생성 시 파라메터의 validation 진행 및 DAL 생성
*/

import Validate from "./validate";
import { Request } from "express";
import Util from "../../libraries/util/util"
import ClientError from "../../libraries/error/clientError";
import DateConvert from "../../libraries/util/date"
import logger from "../../libraries/util/logger";

export default class InterfaceService {
    protected request : Request;
    private _dataAccessLayer : any;
    public validate: any;
    protected dataAccessLayer: any;
    protected current_time: string;
    protected req_Params: any;
    protected adminInfo: any;
    protected util : any;
    protected auth_check_url : any;

    constructor (request: Request, DataAccessLayer: any) {
        this.request = request;
        this._dataAccessLayer = DataAccessLayer;
        this.util = Util;
        this.current_time = DateConvert.getDateToString(undefined);
        this.auth_check_url = ["/api/v1/subscriptions", "/api/v1/controls", "/ap1/v1/qnas"]
    }

    public init = async () => {
        try {
            this.validate = await new Validate(this.request);
            this.adminInfo = this.validate.adminInfo;
            this.dataAccessLayer = new this._dataAccessLayer(this.request.ip, this.validate.adminInfo, this.validate.table);
            this.req_Params = this.validate.getParameters();
        } catch (error) {
            throw error
        }
    }

    public insertData = async () => {
      try {
        if (Object.keys(this.req_Params).length  == 0) {
          throw new ClientError(this.request.ip, "0009");
        }

        this._authCheck('insert');
        this._insertField(this.validate.tableDesc, 'INSERT');
        const db_result: any[] = await this.dataAccessLayer.insertData(this.req_Params);

        if (this.request.baseUrl == '/api/v1/controls') {
          return { result : this.req_Params.code_id }
        } else {
          return { result : '생성을 완료 하였습니다.' };
        }

      } catch (error) {
        return { error }
      }
    }

    public deleteData = async () => {
      try {
        if (Object.keys(this.req_Params).length  == 0) {
          throw new ClientError(this.request.ip, "0009");
        }

        this._authCheck('delete');

        const db_result: any[] = await this.dataAccessLayer.deleteData(this.req_Params);
        return { result : '삭제를 완료 하였습니다.' };
      } catch (error) {
        return { error }
      }
    }

    public updateData = async () => {
      try {
        if (Object.keys(this.req_Params).length <= 1) {
          throw new ClientError(this.request.ip, "0009");
        }

        this._authCheck('update');
        this._insertField(this.validate.tableDesc, 'UPDATE');

        const db_result: any[] = await this.dataAccessLayer.updateData(this.req_Params);
        return { result : '수정을 완료 하였습니다.' };
      } catch (error) {
        return { error }
      }
    }

    public duplicate = async () => {
      try {
        const db_result: any[] = await this.dataAccessLayer.duplicate(this.req_Params);
        if ( db_result.length > 0) {
          if (this.request.baseUrl == "/api/v1/users") {
            throw new ClientError(this.request.ip, "0011");  
          } else {
            throw new ClientError(this.request.ip, "0007");
          }          
        }
        return { result : '사용가능 합니다.' };
      } catch (error) {
        return { error }
      }
    }

    public getCodeName = async (code: string, gubun : string, p_code :string | null) => {
      try {
        const db_result: any[] =  await this.dataAccessLayer.getCodeName(code, gubun, p_code);
        return db_result[0].CODE_NM;
      } catch (error) {
        return {error}
      }
    }

    //추가/수정 시 field에 날짜가 있으면 현재 날짜 넣기
    public _insertField = (tabledesc: any, type : string) => {
      if (type == 'INSERT') {
        for (let item of tabledesc) {
          if (item.Field == 'INSERT_DATE'){
            this.req_Params.insert_date = this.current_time;
            
          }
          if (item.Field == 'UPDATE_DATE'){
            this.req_Params.update_date = this.current_time;
          }
        }
      } else {
        for (let item of tabledesc) {
          if (item.Field == 'UPDATE_DATE'){
            this.req_Params.update_date = this.current_time;
          }
        }
      }      
    }

    public _authCheck = (type : string) => { //권한 체크
      let check_arr : any [] = this.auth_check_url;
      let idx : number = -1;
      
      //권한 체크 예외처리
      if (type == 'update') {
        idx = check_arr.indexOf("/api/v1/controls") ;
      } else if (type == 'insert') {
        idx = check_arr.indexOf("/api/v1/qnas")
      }

      if (idx > -1) {
        check_arr.splice(idx, 1)
      }     
      /////

      for (let url of check_arr) {
        if ((this.request.baseUrl == url) && (this.adminInfo.admin_lv == '2')){
          throw new ClientError(this.request.ip, "0010")
        }        
      }
    }
}