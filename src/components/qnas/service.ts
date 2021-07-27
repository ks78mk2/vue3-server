import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import QNAError from "./error";
import InnerFuncion from "./function";
import InterfaceSerivce from "../interface/serivce";
import DateUtil from "../../libraries/util/date"
import logger from "../../libraries/util/logger"


/* 
  getQNAList : 문의 리스트 가져오기
  getQNACount : 문의 리스트 갯수 가져오기
*/
export default class Service extends InterfaceSerivce {
  constructor(request: Request) {
    super(request, DataAccessLayer) 
  }

  public getQNAList = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getQNAList(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };

  public getQNACount = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getQNACount(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };
}
