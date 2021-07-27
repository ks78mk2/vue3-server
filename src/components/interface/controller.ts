/* 
 공통 controller  
 각 controller 생성 시 여기서 service 초기화 
*/

import { Request, Response } from "express";
import logger from "../../libraries/util/logger";

export default class InterfaceController {
    protected request : Request;
    protected response : Response;
    private _service : any;
    protected service: any;

    constructor (request: Request, response: Response, Service: any) {
        this.request = request;
        this.response = response;
        this._service = Service;
    }

    public init = async () => {
        try {
            this.service = await new this._service(this.request);
            await this.service.init();
        } catch (error) {
            throw error
        }
    }

    public insertData = async () => {
        const { result, error }: any = await this.service.insertData();
        if (error) {
            this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
            this.response.json(result);
        }
    };

    public deleteData = async () => {
        const { result, error }: any = await this.service.deleteData();
        if (error) {
            this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
            this.response.json(result);
        }
    };

    public updateData = async () => {
        const { result, error }: any = await this.service.updateData();
        if (error) {
            this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
            this.response.json(result);
        }
    };

    public duplicate = async () => {
        const { result, error }: any = await this.service.duplicate();
        if (error) {
            this.response.status(error.statusCode).json({ RESULT_MESSAGE: error.message , RESULT_CODE: error.code });
        } else {
            this.response.json(result);
        }
    };   
}