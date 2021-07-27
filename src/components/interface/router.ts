/* 
 공통 router  
 apiBinding으로 service 초기화 후 함수 호출
*/

import { Request, Response } from "express";
import logger from "../../libraries/util/logger";

export default class CommonRouter {
    static apiBinding = async (request: Request, response: Response, Controller: any, functionName: string) => {
        try {
            const controller = await new Controller(request, response);
            await controller.init();
            controller[functionName].call();
        } catch (error) {
            let restApi = ["/pcview", "/commons/uploadfile", "/commons/logo"];
            let restApiFlag : boolean = false;
            for (let item of restApi){
                if (request.originalUrl.indexOf(item) > -1) {
                    restApiFlag = true;
                }
            }
            let resObj = restApiFlag ? { RESULT_MESSAGE: error.message, RESULT_CODE: error.code } : { message: error.message }

            response.status(error.statusCode).json(resObj);
            
        }
    }
}