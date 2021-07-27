import {adminInfo, bookmarkInsert, hideBookmark, getBookmarkList, bookmarkIs} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public bookmarkInsert = async (queryParams : bookmarkInsert) => {
    let query : string = ``
    query += ` VALUES ('${queryParams.p_cust_ctn}', '${queryParams.p_insert_date}', '${queryParams.admin_id}', ${queryParams.bookmark_pos}, ${queryParams.bookmark_type}, 0)`
    const result: any = await this.database.query(query);
    return result;
  };

  public terminalUpdate = async (queryParams : bookmarkInsert) => {
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public hideBookmark = async (queryParams : hideBookmark) => {
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public getBookmarkList = async (queryParams : getBookmarkList) => {
    const query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };

  public bookmarkIs = async (queryParams : bookmarkIs) => {
    let query : string = ``
    const result: any = await this.database.query(query);
    return result;
  };
}
