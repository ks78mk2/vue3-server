import {adminInfo, getChannelList, getChannelCount, getAfterChannel, getReportChannel} from "../interface/interface"
import DateConvert from "../../libraries/util/date"
import InterfaceDAL from "../interface/dataAccessLayer"
import logger from "../../libraries/util/logger";

export default class DataAccessLayer extends InterfaceDAL{
  constructor (ip: string, adminInfo: adminInfo, table: string) {
    super(ip, adminInfo, table)
  }

  public getChannelList = async (queryParams: getChannelList) => {    
    let query : string = ``;
            
    const result: any = await this.database.query(query);
    return result;
  };

  public getChannelCount = async (queryParams: getChannelCount) => {    
    let query : string = ``

    const result: any = await this.database.query(query);
    return result;
  };

  public getCode03 = async (code_01 : string, code_02 : string) => {    
    let query : string = ``;

    const result: any = await this.database.query(query);
    return result;
  };

  public getAfterChannel = async (queryParams: getAfterChannel, today : string) => { //중복조회시 해당 계정의 오늘 날짜 이후 채널 가져오기
    let query : string = ``

    const result: any = await this.database.query(query);
    return result;
  }

  public getReportChannel = async (queryParams : getReportChannel) => { //이력조회 시 사용자 계정의 지난 채널 검색 
    let query : string = ``

    const result: any = await this.database.query(query);
    return result;
  }

  public getOnlineChannel = async (queryParams : {admin_id : string | any}, today : string) => { //현황에서 아직 시작전인 시험 리스트 불러오기
    let query : string = ``

    const result: any = await this.database.query(query);
    return result;
  }

  // public getChannel = async (insert_date : string) => {
  public getChannelInfo = async (queryParams : { code_id :string }) => { //선택한 시험채널의 정보 가져오기 
    let query : string = ``
    
    const result: any = await this.database.query(query);
    return result;
  }
}
