import {adminInfo, getReportList} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"
import logger from "../../libraries/util/logger";

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }
  public getVodDownloadPath = async () => {    
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
  public getVodFileName = async (queryParmas : {cust_ctn : string, insert_date : string}) => {    
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public getUploadDiretory = async (device_id : string) => {    
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
  
  public updateThumbName = async (device_id: string, step: string, file_path : string) => {    
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  };
  
  public updateThumbName2 = async (device_id: string, file_path : string) => {    
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  };

  public getLiveviewAddress = async () => {    
    let query : string = ``;
    const result: any = await this.database.query(query);
    return result;
  };

  public appDownload = async () => {    
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public getLogoFileName = async (queryParmas : {school_key : string}) => {    
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
}
