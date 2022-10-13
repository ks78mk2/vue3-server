import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import ControlError from "./error";
import InnerFuncion from "./function";
import InterfaceSerivce from "../interface/serivce";
import DateUtil from "../../libraries/util/date"
import logger from "../../libraries/util/logger"


/* 
  getChannelList : 채널 리스트 가져오기
  getChannelCount : 채널 갯수가져오기
  controlUpdateData : 채널 수정 (권한 확인)
  duplicate_time : 시험 추가 시 시간 중복체크
  getReportChannel : 이력에서 사용자의 지난시험리스트 가져오기
  getOnlineChannel : 현황에서 사용자의 남은시험리스트 가져오기
  getChannelInfo : 현황에서 선택된(사용자는 가장빠른 시험) 채널정보 가져오기
*/
export default class Service extends InterfaceSerivce {
  constructor(request: Request) {
    super(request, DataAccessLayer)
}

  public getChannelList = async () => {
    try {
      //시험채널리스트 가져오기
      const db_result: any[] = await this.dataAccessLayer.getChannelList(this.req_Params);
      let resultArr : any[] = [];

      //학교명 학과명 가져오기
      for (let item of db_result) {
        let endDate : any = DateUtil.getStringToDateTime(item.START_TIME)
        endDate.setMinutes(endDate.getMinutes() + Number(item.TEST_DURATION));
        let current_date : any = DateUtil.getStringToDateTime(this.current_time);
        
        if (this.adminInfo.admin_lv == '2') { //지난 채널이력은 관리자에게만 허용
          if (endDate > current_date) {    
            resultArr.push(item);
          }
        } else {
          resultArr.push(item);
        }
      }

      return {result : this.util.resultToLower(resultArr)}
    } catch (error) {
      return { error } ;
    }
  };

  public getChannelCount = async () => {
    try {
      //시험채널리스트 가져오기
      const db_result: any[] = await this.dataAccessLayer.getChannelCount(this.req_Params);
      let resultArr : any[] = [];

      for (let item of db_result) {
        let endDate : any = DateUtil.getStringToDateTime(item.START_TIME)
        endDate.setMinutes(endDate.getMinutes() + Number(item.TEST_DURATION));
        let current_date : any = DateUtil.getStringToDateTime(this.current_time);
        
        if (this.adminInfo.admin_lv == '2') { //지난 채널이력은 관리자에게만 허용
          if (endDate > current_date) {  
            resultArr.push(item);
          }
        } else {     
          resultArr.push(item);
        }        
      }
      
      return {result : [{count : resultArr.length}]}
    } catch (error) {
      return { error } ;
    }
  };

  public ControlInsertData = async () => {
    try {
      //code_id 랜덤값
      // let db_result : any[] = await this.dataAccessLayer.getCode03(this.req_Params.code_01, this.req_Params.code_02);
      // let code_03 = db_result[0].CODE_03;
      // this.req_Params.code_03 = code_03;
      
      let code_id : string = '';

      while(1) {
        let codeid = Math.random().toString().substr(2, 9);
        let dupl_result : any[] = await this.dataAccessLayer.getChannelInfo({ code_id: codeid });         

        if (dupl_result.length == 0) {
          code_id = codeid;
          break;
        } 
      }
      
      this.req_Params.code_id = code_id;
      
      return this.insertData(); 
    } catch (error) {
      return { error } ;
    }
  };

  public duplicate_time = async () => {
    try {
      if (this.req_Params.start_time <= this.current_time) { //이미 지난 시간은 등록 안됨
        throw new ControlError(this.request.ip, "0000");
      }
      
      let check : boolean = false;
      let errMsg : string = "동시간대 시험이 존재합니다. 시간을 변경하여 주십시오.";
      let today : string = this.current_time.slice(0, 8);
      const db_result: any[] = await this.dataAccessLayer.getAfterChannel(this.req_Params, today);
      let start_range : any = DateUtil.getStringToDateTime(this.req_Params.start_time); // Date() 형태로 가져오기
      let end_range : any = DateUtil.getStringToDateTime(this.req_Params.start_time); // Date() 형태로 가져오기
      start_range.setMinutes(start_range.getMinutes() - 60);    // 시험시작 1시간전 
      end_range.setMinutes(end_range.getMinutes() + Number(this.req_Params.test_duration)); //시험종료시간

      logger.info("start_range: " + start_range);
      logger.info("end_range: " + end_range);

      // 시험시작 1시간 전과, 종료시간 사이에 겹치는 시험이 있는 지 확인
      for (let item of db_result) {
        let check_start : any = DateUtil.getStringToDateTime(item.START_TIME);
        let check_end : any = DateUtil.getStringToDateTime(item.START_TIME);
        check_start.setMinutes(check_start.getMinutes() - 60);    // 기 등록 시험시작 1시간전 
        check_end.setMinutes(check_end.getMinutes() + Number(item.TEST_DURATION)); //기 등록 시험 종료시간

        // 1. 시작 시간, 2. 종료시간 
        //-------1-----------2-----------   기등록시험
        //------------1-----------2------   등록할 시험
        //요청 시작시간이 기등록 시작시간보다 같거나 크면서, 기등록 종료시간보다 작을때 
        if ((start_range >= check_start) && (start_range < check_end)) {
          logger.info('시작시간이 범위에 걸림');
          check = true;

          let start_diff = (start_range - check_start) /1000 /60; // 기등록 시작 시간과 요청 시작시간의 차(분)
          if (start_diff <= 60) {
            errMsg = "타 시험 시작시간 1시간 이내는 등록할 수 없습니다.";
          }
        }

        //-----------1-----------2-------   기존시험
        //-------1----------2------------   등록할 시험
        //요청 종료시간이 기등록 시작시간보다 크면서, 기등록 종료시간보다 같거나 작을때 
        if ((end_range > check_start) && (end_range <= check_end)) {
          logger.info('종료시간이 범위에 걸림');
          check = true;
        }

        //-----------1--------2----------   기존시험
        //-------1-----------------2-----   등록할 시험
        //요청 시작시간이 기등록 시작시간보다 같거나 작으면서, 종료시간이 기등록 종료시간보다 같거나 클때
        if ((start_range <= check_start) && (end_range >= check_end)) {
          logger.info('시험시간이 범위에 걸림');
          check = true;
        }
      }
      
      if (check == true) {  //겹치는 시험 있음
        return { error : { statusCode : 400, message : errMsg}}
      } else {
        return { result : '등록 가능한 시간입니다.'}
      }
    } catch (error) {
      return { error } ;
    }
  };

  public getReportChannel = async () => {
    try {
      //시험 리스트 가져오기 
      const db_result: any[] = await this.dataAccessLayer.getReportChannel(this.req_Params);
      let resultArr : any[] = [];
      
      for (let item of db_result) {
        let endDate : any = DateUtil.getStringToDateTime(item.START_TIME)
        endDate.setMinutes(endDate.getMinutes() + Number(item.TEST_DURATION));
        let current_date : any = DateUtil.getStringToDateTime(this.current_time);
        
        if (endDate < current_date) {    //시험의 종료시간이 지났다면
          resultArr.push(item);
        }
      }
      if (resultArr.length == 0) {
        throw new ControlError(this.request.ip, "0003")
      }
      return { result : this.util.resultToLower(resultArr) }
      // if (db_result.length == 0) {
      //   throw new ControlError(this.request.ip, "0003")
      // }
      // return { result : this.util.resultToLower(db_result) }

    } catch (error) {
      return { error } ;
    }
  }
  
  public getOnlineChannel = async () => {
    try {
      //남은 시험 리스트 가져오기 
      let today : string = this.current_time.slice(0, 8);
      const db_result: any[] = await this.dataAccessLayer.getOnlineChannel(this.req_Params, today);
      let resultArr : any[] = [];
      
      for (let item of db_result) {
        let endDate : any = DateUtil.getStringToDateTime(item.START_TIME)
        endDate.setMinutes(endDate.getMinutes() + Number(item.TEST_DURATION));
        let current_date : any = DateUtil.getStringToDateTime(this.current_time);
        
        if (endDate > current_date) {   //시험의 종료시간이 넘지 않았다면
          resultArr.push(item);
        }
      }

      if (resultArr.length == 0) {
        throw new ControlError(this.request.ip, "0002")
      }
      return { result : this.util.resultToLower(resultArr) }

    } catch (error) {
      return { error } ;
    }
  }

  public getChannelInfo = async () => {
    try {
      //시험채널 정보 가져오기      
      // let insert_date : string = this.current_time.substring(0, 8);
      // const db_result: any[] = await this.dataAccessLayer.getChannel(insert_date);
      const db_result: any[] = await this.dataAccessLayer.getChannelInfo(this.req_Params);

      let current_date : any = DateUtil.getStringToDateTime(this.current_time); // Date() 형태로 가져오기      
      let start_date : any = DateUtil.getStringToDateTime(db_result[0].START_TIME); // Date() 형태로 가져오기      
      let diff : any = (start_date - current_date) /1000; //시험시작시간까지 남은 시간 (초)

      if (diff > 3630) { //남은 시간이 60분 30초 이상일 경우 
        throw new ControlError(this.request.ip, "0001");
      }
    
      return { result : this.util.resultToLower(db_result) }      
    } catch (error) {
      return { error } ;
    }
  };
}
