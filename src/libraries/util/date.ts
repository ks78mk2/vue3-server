import SystemError from "../error/systemError";
import logger  from "./logger"  
export default class DateConvert {
    static getDateToString(date : any) : string {  //현재 시간을 'yyyyMMddhhmmss'로..
        try {  
            let _date = new Date();     
            if (date != undefined) {    // undefined 가 아니면 date 사용
                _date = date;
            }            
            let year : any = _date.getFullYear();
            let month : any = _date.getMonth() + 1;
            let day : any = _date.getDate();
            let hour : any = _date.getHours();
            let min : any = _date.getMinutes();
            let second : any = _date.getSeconds();
    
            return [year,
            '' + (month > 9 ? '' : 0) + month,
            '' + (day>9 ? '' : '0') + day,
            '' + (hour>9 ? '' : '0') + hour,
            '' + (min>9 ? '' : '0') + min,
            '' + (second>9 ? '' : '0') + second,
            ].join('');
        } catch (error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }        
    }

    static getStringToDateTime(strTime: string) { // 'yyyyMMddhhmmss' 형식을 date형식으로..
        try {
            if (strTime.length === 14) {
                let year = +strTime.substr(0, 4);
                let month = +strTime.substr(4, 2)-1;
                let day = +strTime.substr(6, 2);
                let hour = +strTime.substr(8, 2);
                let min = +strTime.substr(10, 2);
                let sec = +strTime.substr(12, 2);

                return new Date(year, month, day, hour, min, sec);
            }
            throw new Error(strTime + ' is not format string time!');
        }
        catch(error) {
            logger.info("system Error" + error);
            throw new SystemError('', "9999");
        }        
    }
}
