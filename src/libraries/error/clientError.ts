import logger from "../util/logger";

export default class ClientError extends Error {
  public code: string;
  public message: string;
  public statusCode: number;
  private ip: string;

  constructor(...args: any) {
    super(...args);
    this.ip = args[0].indexOf(':') >= 0 ? args[0].substring(args[0].lastIndexOf(':') + 1) : args[0];
    this.code = args[1];
    this.statusCode = args[2] || 400;
    this.message = this.getErrorMessage(this.constructor.name);
  }

  public getErrorMessage (componentName: string) {
    const errMsg: any = {
      "ClientError": {
        "9998": "Mandatory parameter is not enough",
        "0001": "Parameter type error",
        "0002": "Parameter size exceed",
        "0003": "존재하지 않는 parameter가 포함되어 있습니다.",
        "0004": "정의되지 않은 Parameter가 존재합니다.",
        "0005": "No token provided",
        "0006": "수정할 수 없는 항목이 포함되어 있습니다.",
        "0007": "요청한 자원은 이미 존재합니다.",
        "0008": "Failed to authenticate token.",
        "0009": "요청 파라메터가 존재하지 않습니다.",
        "0010": "권한이 없습니다.",
        "0011": "이미 사용 중인 아이디 입니다."
      },"UserError": {
        "0001": "아이디 혹은 비밀번호가 일치하지 않습니다.",
        "0002": "비밀번호 5회 실패로 로그인 할 수 없습니다.",
        "0003": "아이디에 특수문자가 포함되어 있습니다.",
        "0004": "8자리 ~ 20자리 이내로 입력해주세요.",
        "0005": "비밀번호는 공백 없이 입력해주세요.",
        "0006": "영문, 숫자, 특수문자를 혼합하여 입력해주세요.",
        "0007": "아이디는 5~20자로 입력해 주십시오.",
        "0008": "존재하지 않는 이메일 입니다. 사용중인 이메일을 입력해주세요."
      },"CommonError": {
        "0000" : "파일명이 없습니다.",
        "0001" : "파일이 존재하지 않습니다.",
        "0002" : "메일 전송에 실패하였습니다.",
        "0011" : "디바이스 아이디 없음",
        "0012" : "기타 업로드 에러"
      },"ControlError": {
        "0000" : "지난 시간에 등록 할 수 없습니다.",
        "0001" : "시험 준비 시간이 아닙니다.",
        "0002" : "금일 예정된 시험이 없습니다.",
        "0003" : "지난 이력이 없습니다."
      },"SubError": {
        "0000" : "올바른 인증코드를 입력하여 주십시오.",
        "0001" : "정교수 계정과 부교수 계정은 같을수 없습니다."
      },"DepartmentError" : {
        "0000" : "요청한 자원은 이미 존재합니다.",
        "0010" : "권한이 없습니다."
      }, "OnlineError" : {
      }, "AnalyzeError" :{
      }, "ChoiceError" : {
      }, "BookmarkError" : {
        "0001" : "디바이스 아이디 없음",
        "0002" : "해당 북마크 없음"
      }, "ReportError" : {
        "0000" : "시험코드가 없습니다.",
        "0001" : "권한이 없습니다.",
        "0002" : "파일이 존재하지 않습니다.",
        "0003" : "파일 생성에 실패하였습니다.",
        "0004" : "이력이 존재하지 않습니다."
      }

    };

    if (errMsg[componentName][this.code] === undefined) {
      logger.error(`[${this.ip}] -> ${componentName} : unknown error`);
      return "unknown error";
    } else {
      logger.error(`[${this.ip}] -> ${componentName} : ${errMsg[componentName][this.code]}`);
      return errMsg[componentName][this.code];
    }
  };
}
