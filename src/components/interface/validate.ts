import db from "../../libraries/database/dbConfig";
import ClientError from "../../libraries/error/clientError";
import SystemError from "../../libraries/error/systemError";
import config from "../../../config/config.json";
import validateJson from "../../../config/validate.json"
import { Request } from "express";
import { decodeToken } from "../../libraries/util/token"
import { adminInfo } from "./interface"
import logger from "../../libraries/util/logger";

export default class Validate {
  public table: string;
  public tableDesc: any;
  private params: any;
  private methods: string;
  private baseUrl: string;
  private url: string
  public adminInfo : adminInfo | undefined | any;
  private modify_key : any;
  private ip: any;
  private database: any
  private file: any

  constructor(req: Request) {
    try {
      return <any> (async () => {
        this.ip = req.ip;
        this.methods = req.method;
        this.baseUrl = req.baseUrl
        this.url = req.originalUrl;
        this.file = req.file;
        this.database = new db(this.ip);
        this.adminInfo = await this._getAdminInfo(req);
  
        const tableConfig: any = config.table;
        for (let item in tableConfig) {
          if (item == this.baseUrl) {
            this.table = tableConfig[item];
          }
        }
  
        this._setParams(req);
        if (this.table !== undefined) {
          await this._init();    
        }
        await this._checkParameter();
        
        return this;
      })();
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("return system Error " + error);
        throw new SystemError('', "9999");        
      } 
    } 
  }

  private _init = async () => {
    try {
      let query = `DESCRIBE ${this.table}`;
      this.tableDesc = await this.database.query(query);
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("init system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }      
  };

  private _getAdminInfo = async (req: Request) => {
    try {
      const token: string = req.body.token || req.query.token || req.headers["x-access-token"];
      
      if (token != undefined) {
        const parseToken: any = await decodeToken(token, function (err: any, decoded: any) {
          return decoded;
        });
        
        if (parseToken == undefined) {
          return undefined;
        } else {
          return {
            admin_id: parseToken.admin_id,
            code_01: parseToken.code_01,
            code_02: parseToken.code_02,
            code_01_nm :  parseToken.code_01_nm,
            code_02_nm :  parseToken.code_02_nm,
            admin_lv :  parseToken.admin_lv
          };
        }        
      } else {
        return undefined;
      }
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("getAdminInfo system Error " + error);
        throw new SystemError('', "9999");        
      } 
    } 
  }; 
  private _setParams = (req: Request) => {
    try {
      switch (this.methods) {
        case "PUT":
          if (Object.keys(req.params).length > 0) {
            this.params = req.body;
            this.modify_key = req.params;
          }
        case "POST":
          this.params = req.body;
          break;
        case "GET":
          if (Object.keys(req.query).length > 0) {
            this.params = req.query;
          } else {
            this.params = req.params;
          }
          break;
        case "DELETE":
          this.params = req.params;
      }
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("setParams system Error " + error);
        throw new SystemError('', "9999");        
      } 
    } 
  };

  private _typeOf(mysqlType: string) {
    try {
      let type = mysqlType.split("(")[0].toLowerCase();
      switch (type) {
        case "varchar":
        case "varchar2":
        case "char":
        case "text":
          return "string";
        case "int":
          return "number";
        default:
          return "undefined";
      }
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("typeof system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }   
  }

  private _checklength(mysqlType: string, val: any) {
    try {
      let type = mysqlType.split("(")[0].toLowerCase();
      switch (type) {
        case "varchar":
        case "varchar2":
        case "char":
          let max = mysqlType.replace(/[^0-9]/g, "");
          if (val.length > max) {
            return false;
          }
          break;
        case "int":
          if (val > 4294967295) {
            return false;
          }
          break;
        case "text":
          return true;
        default:
          return false;
      }
      return true;
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("checklength system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }  
  }

  // 파라미터 값 검증
  private _lengthTypeCheck = () => {
    try {
      const params: any = this._getValidParameters();
      for (let key in params) {
        for (let item of this.tableDesc) {
          if (item.Field == key) {
            // 파라미터 타입 확인          
            if (this._typeOf(item.Type) !== typeof params[key]) {
              throw new ClientError(this.ip, "0001", undefined, params[key]);
            }
            // 파라미터 최대 크기 확인
            if (!this._checklength(item.Type, params[key])) {
              throw new ClientError(this.ip, "0002", undefined, params[key]);
            }
          }
        }
      }
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("lengthTypeCheck system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }  
  };

  // 요청 파라미터의 존재하지 않는 컬럼 포함 여부확인
  private _unKnownCheck = () => {
    try {
      const params = this._getValidParameters();
      let unKnown = true;
      for (let desc in params) {
        for (let item of this.tableDesc) {
          if (item.Field == desc.toUpperCase()) {
            unKnown = true;
            break;
          } else {
            unKnown = false;
          }
        }
      }
      if (unKnown == false) {
        throw new ClientError(this.ip, "0003");
      }
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("unKnownCheck system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }  
  };

  //put 메소드인 경우 변경할 파라미터에 primary key가 존재할 경우 오류 응답
  private _checkPrimarykeyChanged = () => {
    try {
      const params = this._getValidParameters();
      for (let item of this.tableDesc) {
        if (item.Key == "PRI") {
          if (params.hasOwnProperty(item.Field) == true) {
            throw new ClientError(this.ip, "0006", undefined, item.Field);
          }
        }
      }
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("checkPrimaryKeyChanged system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }     
  };

  private _getValidParameters = () => {
    try {
      let obj: any = {};
      for (let item in this.params) {
        let keys = item.toLowerCase();
        obj[keys] = this.params[item];
      }
      return new Object(obj);
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("getValidParameters system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }     
  }

  public getParameters = () => {
    try {
      let obj : any = this._getValidParameters();

      if (this.modify_key != undefined) {  // 수정일 경우 조건값으로 들어가는 key는 req_params에 key_를 붙여서 넣어준다
        for (let item in this.modify_key) {
          obj['KEY_'+item.toLowerCase()] = this.modify_key[item];
        }
      }
      return new Object(obj);
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("getParameters system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }    
  };

  private _essentialCheck = () => {
    try {
      // 필수 파라미터 확인
      const validate: any = validateJson;
      const url: string = this.url;
      let params: any 
      if ((this.methods == 'PUT') && (url.indexOf('/pcview/bookmarkdel') < 0)){
        params = this.modify_key;
      } else {
        params = this._getValidParameters();  
      }      
      
      let essentialParams: any = undefined;    

      for (let item in validate[this.methods]) {
        if (url.indexOf(item) > -1) {
          essentialParams = validate[this.methods][item]
        }
      }    
      if (essentialParams != undefined) {
        for (let param of essentialParams) {
          if (params.hasOwnProperty(param.toLowerCase()) == false) {
            throw new ClientError(this.ip, "9998");
          } else if (params[param.toLowerCase()] == undefined) {
            throw new ClientError(this.ip, "0004");
          }
        }
      } 

      //uploadFile
      if (url.indexOf('/commons/uploadfile') > -1) {
        if (this.file == undefined) {
          throw new ClientError(this.ip, "9998");
        }
      }      
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("essentialCheck system Error " + error);
        throw new SystemError('', "9999");        
      } 
    } 
  }

  //파라미터 타입/NULL 체크 등
  //insert, update 인 경우에만 타입/unknown 등 체크
  private _checkParameter = () => {
    try {
      if (this.tableDesc !== undefined && this.tableDesc !== null) {
        if (this.methods == "POST" && this.url === this.baseUrl) {
          this._lengthTypeCheck();
          this._unKnownCheck();
        } else if (this.methods == "PUT") {
          this._lengthTypeCheck();
          this._checkPrimarykeyChanged();
          this._unKnownCheck();
        } 
      }    
  
      this._essentialCheck();   
    } catch(error) {
      if (typeof error.statusCode != 'undefined') {
        throw error;
      } else {
        logger.info("checkParameter system Error " + error);
        throw new SystemError('', "9999");        
      } 
    }  
  };
}
