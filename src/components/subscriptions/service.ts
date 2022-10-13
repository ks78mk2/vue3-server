import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import SubError from "./error";
import InnerFuncion from "./function";
import InterfaceSerivce from "../interface/serivce";
import DateUtil from "../../libraries/util/date"
import logger from "../../libraries/util/logger"


/* 
  getSubscriptionList : 상품구매 요청 리스트 가져오기
  getSubscriptionCount : 상품구매 요청 count 가져오기
  getAdminInfo : 상품구매 요청 info 가져오기
  subInsertData : 상품구매 요청
*/
export default class Service extends InterfaceSerivce {
  constructor(request: Request) {
    super(request, DataAccessLayer) 
  }

  public getSubscriptionList = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getSubscriptionList(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };

  public subInsertData = async () => {
    try {
      if (this.req_Params.admin_id == this.req_Params.admin_id_sub) {
        throw new SubError(this.request.ip, "0001")
      }
      return this.insertData();
    } catch (error) {
      return { error } ;
    }
  };

  public getSubscriptionCount = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getSubscriptionCount(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };

  public getAdminInfo = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getAdminInfo(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };
}
