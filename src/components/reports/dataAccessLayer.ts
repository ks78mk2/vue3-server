import {adminInfo, getReportList, getReportCount} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"

const CHECKTYPE_CONF : any[] = ['ERR_1', 'ERR_2', 'ERR_3', 'ERR_4', 'ERR_5', 'U_BOOKMARK']
export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public getReportList = async (queryParams : getReportList) => {
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  };

  public getControlInfo = async (code_id : string) => {
    let query : string = ``;
    const result : any = await this.database.query(query); 
    return result;
  }

  public getDefectCode = async (defect_code : string) => {
    let query : string = ``;
    const result: any = await this.database.query(query);
    return result;
  }
}