import {signin, tryCntUpdate, adminInfo} from "../interface/interface"
import InterfaceDAL from "../interface/dataAccessLayer"

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public signin = async (queryParam : signin) => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public tryCntUpdate = async (queryParam : tryCntUpdate) => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  }

  public passInit = async (admin_id : string, password: string) => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  }
}
