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

  public bookmarkInsert = async () => {
    try {
      if (this.req_Params.p_cust_ctn == '' || this.req_Params.p_cust_ctn == null) {
        throw new BookmarkError (this.request.ip, "0001");
      }
      const db_result: any[] = await this.dataAccessLayer.bookmarkInsert(this.req_Params);

      if (this.req_Params.bookmark_type == '1') { //사용자 북마크 인경우 TB_TERMINAL_IMAGE_TRANS 업데이트
        await this.dataAccessLayer.terminalUpdate(this.req_Params);
      }
      return { result : { RESULT_CODE : "0000", RESULT_MESSAGE : "북마크 등록 성공"} }

    } catch (error) {
      let newError =  error;
      let msg : string = error.message;
      if (msg.indexOf('ER_DUP_ENTRY') > -1) {
        newError = { code : "0002", message: "중복 등록", statusCode : 400, ip : error.ip}
      }
      return { error: newError } ;
    }
  };

  public hideBookmark = async () => {
    try {
      if (this.req_Params.p_cust_ctn == '' || this.req_Params.p_cust_ctn == null) {
        throw new BookmarkError (this.request.ip, "0001");
      }
      const db_result: any[] = await this.dataAccessLayer.bookmarkIs(this.req_Params);
      if (db_result.length == 0) {
        throw new BookmarkError (this.request.ip, "0002");
      }
      const db_result2: any[] = await this.dataAccessLayer.hideBookmark(this.req_Params);
      return { result : { RESULT_CODE : "0000", RESULT_MESSAGE : "북마크 삭제 성공"} }
    } catch (error) {
      return { error } ;
    }
  };

  public getBookmarkList = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.getBookmarkList(this.req_Params);
      return { result : { TOTAL_COUNT: db_result.length, LIST: this.util.resultToLower(db_result)} }
    } catch (error) {
      return { error } ;
    }
  };
}