import {adminInfo} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"
import logger from "../../libraries/util/logger";

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public getCode01 = async () => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public getCode02 = async (queryParam : {p_code : string}) => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  }

  public insertCode = async (queryParam : {code_01_nm : string | undefined, code_02_nm : string | undefined, p_code : string | null | undefined}, gubun: string) => {
    let query : string = ''

    const result: any = await this.database.query(query);
    return result;
  }

  public duplicate_codename = async (queryParam : {code_01_nm : string | any, code_02_nm : string | any}, gubun: string, p_code: string) => {
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  }

  public getCode = async (code_nm : string, gubun : string, p_code :string | undefined) => {
    let query : string = '';
  
    const result: any = await this.database.query(query);
    return result;
  }
}
