import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import ReportError from "./error";
import InnerFuncion from "./function";
import InterfaceService from "../interface/serivce";
import logger from "../../libraries/util/logger";


/* 

*/
export default class Service extends InterfaceService {
  constructor(request: Request) {
    super(request, DataAccessLayer)
}

  public getAnalyzeCount = async () => {
    try {
      //이력 count 가져오기
      const db_result: any[] = await this.dataAccessLayer.getAnalyzeCount(this.req_Params);
      return { result : this.util.resultToLower(db_result) }

    } catch (error) {
      return { error } ;
    }
  }

  public getAnalyzeList = async () => {
    try {
      //이력 count 가져오기
      const err_1: any[] = await this.dataAccessLayer.getAnalyzeList(this.req_Params, "ERR_1");
      const err_2: any[] = await this.dataAccessLayer.getAnalyzeList(this.req_Params, "ERR_2");
      const err_3: any[] = await this.dataAccessLayer.getAnalyzeList(this.req_Params, "ERR_3");
      const err_4: any[] = await this.dataAccessLayer.getAnalyzeList(this.req_Params, "ERR_4");
      const err_5: any[] = await this.dataAccessLayer.getAnalyzeList(this.req_Params, "ERR_5");
      const u_bookmark: any[] = await this.dataAccessLayer.getAnalyzeList(this.req_Params, "U_BOOKMARK");

      let result_data : any = {};
      result_data.err_1 = this.util.resultToLower(err_1);
      result_data.err_2 = this.util.resultToLower(err_2);
      result_data.err_3 = this.util.resultToLower(err_3);
      result_data.err_4 = this.util.resultToLower(err_4);
      result_data.err_5 = this.util.resultToLower(err_5);
      result_data.u_bookmark = this.util.resultToLower(u_bookmark);

      return { result : result_data}

    } catch (error) {
      return { error } ;
    }
  }
}
