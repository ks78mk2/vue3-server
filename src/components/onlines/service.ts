import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import OnlineError from "./error";
import InnerFuncion from "./function";
import InterfaceService from "../interface/serivce";
import DateUtil from "../../libraries/util/date"
import logger from "../../libraries/util/logger";


/* 
  getOnlineList : 참여인원 가져오기
*/
export default class Service extends InterfaceService {
  constructor(request: Request) {
    super(request, DataAccessLayer)
}

  public getOnlineList = async () => {
    try {
      let today : string = this.current_time.substring(0, 8); //오늘날짜의 학생만 가져오기
      const db_result: any[] = await this.dataAccessLayer.getOnlineList(this.req_Params, today);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };
}