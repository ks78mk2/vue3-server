import { Request } from "express";
import DataAccessLayer from "./dataAccessLayer";
import UserError from "./error";
import InnerFunction from "./function";
import InterfaceService from "../interface/serivce";
import logger from "../../libraries/util/logger";
const server = require('../../index');

export default class Service extends InterfaceService {
  constructor(request: Request) {
    super(request, DataAccessLayer);
  }
  
  public userInsertData = async () => {
    try {
      //비밀번호 검증
      let checkPassword : string | null = InnerFunction.check_password(this.req_Params.admin_pw);
      if (checkPassword != null) {
        throw new UserError(this.request.ip, checkPassword);
      }

      //비밀번호 변환
      let enc_pw : string = InnerFunction.encryptPassword(this.req_Params.admin_pw);
      this.req_Params.admin_pw = enc_pw;   
      this.req_Params.admin_lv = '2';
      return this.insertData(); 
    } catch (error) {
      return { error } ;
    }
  }

  public userUpdateData = async () => {
    try {
      //비밀번호 변환
      if (this.req_Params.admin_pw != undefined) {
        let enc_pw : string = InnerFunction.encryptPassword(this.req_Params.admin_pw);
        this.req_Params.admin_pw = enc_pw;   
      }
      
      return this.updateData(); 
    } catch (error) {
      return { error } ;
    }
  }

  public email_existence = async () => {
    try {
      let result : any = await InnerFunction.emailCheck(this.req_Params.admin_id, this.request.ip);
      return { result }
    } catch (error) {
      return { error }
    }
  }

  public passInit = async () => {
    try {
      let password: string = Math.random().toString(36).substr(2,11);
      let enc_pw : string = InnerFunction.encryptPassword(password);
      await this.dataAccessLayer.passInit(this.req_Params.admin_id, enc_pw);
      return { result: [{password}] }
    } catch (error) {
      return { error }
    }
  }

  public passCheck = async () => {
    try {
      const db_result: any[] = await this.dataAccessLayer.signin(this.req_Params);

      //비밀번호 오류
      if (!InnerFunction.comparePassword(this.req_Params.admin_pw, db_result[0].ADMIN_PW)){
        throw new UserError(this.request.ip, "0001");
      }

      return { result : "일치합니다."}
    } catch (error) {
      return { error }
    }
  }

  public signin = async () => {
    try {
      //계정 조회
      const db_result: any[] = await this.dataAccessLayer.signin(this.req_Params);

      //결과 없음
      if (!db_result.length) { 
        throw new UserError(this.request.ip, "0001");
      }

      //로그인 시도 5회 실패
      if (db_result[0].LOGIN_TRYCNT >= 5) {     // 5
        throw new UserError(this.request.ip, '0002');
      }

      //비밀번호 오류
      if (!InnerFunction.comparePassword(this.req_Params.admin_pw, db_result[0].ADMIN_PW)){
        await this.dataAccessLayer.tryCntUpdate({admin_id: db_result[0].ADMIN_ID ,login_trycnt: String(Number(db_result[0].LOGIN_TRYCNT) + 1), current_time : this.current_time});
        throw new UserError(this.request.ip, "0001");
      }

      //로그인 성공
      await this.dataAccessLayer.tryCntUpdate({admin_id: db_result[0].ADMIN_ID, login_trycnt: '0', current_time : this.current_time});
     
      //토큰발급
      let payload = {
        admin_id: db_result[0].ADMIN_ID,
        admin_nm: db_result[0].ADMIN_NM,
        admin_lv : db_result[0].ADMIN_LV
      }
      let accessToken = await InnerFunction.getAccessToken(payload);
      server._io.sockets.emit('logout', payload.admin_id, '다른 브라우저에서 로그인하여 현재 연결을 종료합니다.');
      logger.info(`${payload.admin_id} login success, accessToken : ${accessToken}`)
      const result = { 
        accessToken: accessToken
      }
      return { result };

    } catch (error) {
      return { error } ;
    }
  };

  public getUserList = async () => {
    try {
      //학교 리스트 가져오기
      const db_result: any[] = await this.dataAccessLayer.getUserList(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };

  public getLiveviewUser = async () => {
    try {
      //학교 리스트 가져오기
      const db_result: any[] = await this.dataAccessLayer.signin(this.req_Params);
      return { result : this.util.resultToLower(db_result) }
    } catch (error) {
      return { error } ;
    }
  };

  public signout = async () => {
    try {
      // return { result : this.util.resultToLower(db_result) }
      return { result : '로그아웃 되었습니다.' }
    } catch (error) {
      return { error } ;
    }
  }
}
