import {adminInfo, viewChoice} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public getViewChoice = async (queryParams : viewChoice) => {
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public deleteViewChoice = async (queryParams : viewChoice) => {
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
  
  public postViewChoice = async (queryParams : viewChoice) => {
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
}
