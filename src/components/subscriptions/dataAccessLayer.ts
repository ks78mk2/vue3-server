import {adminInfo, getSubscriptionList, getSubscriptionCount, getAdminInfo} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"
import logger from "../../libraries/util/logger";

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }
 
  public getSubscriptionList = async (queryParams : getSubscriptionList) => {
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  };

  public getSubscriptionCount = async (queryParams : getSubscriptionCount) => {
    let query : string = ``
      
    const result: any = await this.database.query(query);
    return result;
  };

  public getAdminInfo = async (queryParams : getAdminInfo) => {
    let query : string = ``;
      
    const result: any = await this.database.query(query);
    return result;
  };
}
