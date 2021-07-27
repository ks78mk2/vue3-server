import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import BookmarkError from "./error";
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

  public postViewChoice = async () => {
    try {
      const existView : any[] = await this.dataAccessLayer.getViewChoice(this.req_Params);
      if (existView.length > 0) {
        await this.dataAccessLayer.deleteViewChoice(this.req_Params);
      } 
      
      await this.dataAccessLayer.postViewChoice(this.req_Params);
            
      return { result : "성공하였습니다." }
    } catch (error) {
      return { error } ;
    }
  };
}