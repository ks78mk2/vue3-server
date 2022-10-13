import { createToken } from "../../libraries/util/token"
import Util from "../../libraries/util/util"
import logger from "../../libraries/util/logger"
import SystemError from "../../libraries/error/systemError"
import crypto from 'crypto'
import DateConvert from '../../libraries/util/date'
import UserError from "./error";
const emailExistence = require('email-existence');


export default class InnerFunction {
    
    //로그인 시 password 비교
    static comparePassword = (candidatePassword: string, hashPassword: string) => {
        try {
            const hash_input: string = crypto.createHash('sha256').update(candidatePassword).digest('hex');
            if (hash_input === hashPassword) {
                return true;
            } else {
                return false;
            }
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }
    }

    //password변환
    static encryptPassword = (candidatePassword: string) => {
        try {
            return crypto.createHash('sha256').update(candidatePassword).digest('hex');
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }       
    }   

    static checkPasswordChangeCycle = (lastUpdatedDate: string, elapsedDays: number) => {
        try {
            if (Util.term(new Date(), DateConvert.getStringToDateTime(lastUpdatedDate)) > elapsedDays) {
                return false;
            }
            return true;
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }
    }

    //숫자, 영문, 특수문자, 8자리, 공백X
    static check_password (str: string) { 
        try {
            let pw  :string = str;
            let num :any  = pw.search(/[0-9]/g);
            let eng :any  = pw.search(/[a-z]/ig);
            let spe :any  = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

            if (pw.length < 8 || pw.length > 20){
                return '0004';
            }else if(pw.search(/\s/) != -1){
                return '0005';
            }else if(num < 0 || eng < 0 || spe < 0 ){
                return '0006';
            }else {
                return null;
            }
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }  
    }

    //토큰발급
    static getAccessToken = async (payload: object) => {
        try {
            return await createToken(payload);
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }
    }

    static emailCheck = (admin_id: string, ip: string) => {
        return new Promise(function(resolve: any, reject: any){
            let that = this;
            emailExistence.check(admin_id, function(error: any, response: any){
                if (response == false || response == 'false') {
                    let error = new UserError(ip, "0008");
                    reject(error)
                } else {
                    resolve("사용가능 합니다.")
                }
            })      
        });
    }
}