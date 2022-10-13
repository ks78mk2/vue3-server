import {adminInfo, getQNAList, getQNACount} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"
import logger from "../../libraries/util/logger";

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }
 
  public getQNAList = async (queryParams : getQNAList) => {
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  };

  public getQNACount = async (queryParams : getQNACount) => {
    let query : string = ``
      
    const result: any = await this.database.query(query);
    return result;
  };
}
