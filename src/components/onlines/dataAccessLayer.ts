import {adminInfo, getReportList} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public getOnlineList = async (queryParams : {code_id : string}, today: string) => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
}
