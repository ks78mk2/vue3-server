import SystemError from "../error/systemError";
import logger  from "./logger"
const iconvLite = require('iconv-lite');

export default class Util {
    static term (date1: any, date2: any) {
        try {
            if (!(date1 instanceof Date)) {
                throw new Error(date1 + ' is not format Date() format!');
            }
            if (!(date2 instanceof Date)) {
                throw new Error(date2 + ' is not format Date() format!');
            }
            const diff = date1.getTime() - date2.getTime();
            return Math.floor(diff / (1000*3600*24));
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }        
    }

    static getDownloadFilename(req: any, filename: any) {
        var header = req.headers['user-agent'];
      
        if (header.includes("MSIE") || header.includes("Trident")) { 
            return encodeURIComponent(filename).replace(/\\+/gi, "%20");
        } else if (header.includes("Chrome")) {
            return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
        } else if (header.includes("Opera")) {
            return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
        } else if (header.includes("Firefox")) {
            return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
        }
      
        return filename;
      }

    static leadingZeros (n: any, digits: any) {
        try {
            let zero = '';
            n = n.toString();
        
            if (n.length < digits) {
                for (let i = 0; i < digits - n.length; i++)
                    zero += '0';
            }
            return zero + n;
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }          
    }

    static resultToLower (result : any) {
        try {
            let lowerArr : any[] = new Array();
            for (let obj of result) {
                let temp : any = {};
                for (let item in obj) {
                    temp[item.toLowerCase()] = obj[item];
                }
                lowerArr.push(temp);
            }
            return lowerArr;
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }          
    }

    //특수문자 체크 , true : 특수문자 있음, false : 특수문자 없음
    static check_spc (str: string) {
        try {
            let pattern_spc = /[~!@#$%^&*()+|<>?:{}]/;
            if (pattern_spc.test(str)) {
                return true;
            } else return false;
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }          
    }

    //숫자만 입력 , true : 통과, false : 숫자 외 글자 있음
    static check_only_number (str: string) { 
        try {
            let pattern_num = /[0-9]/;	// 숫자 
            let pattern_eng = /[a-zA-Z]/;	// 문자 
            let pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
            let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
            
            if( (pattern_num.test(str)) && !(pattern_eng.test(str)) && !(pattern_spc.test(str)) && !(pattern_kor.test(str))){ 
                return true;
            } else return false;
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }          
    }
}