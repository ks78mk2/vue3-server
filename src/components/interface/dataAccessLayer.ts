/* 
 공통 Data Access Layer  
 각 DAL 생성 시 여기서 admin 정보를 저장하고 공통 count paging 등의 쿼리 수행 
*/
import { adminInfo } from "./interface"
import db from "../../libraries/database/dbConfig";

export default class InterfaceDAL {
    private table : string;
    public database: any;
    public adminInfo : adminInfo;

    constructor (ip: string,  adminInfo : adminInfo, table : string) {
        this.database = new db(ip);
        this.adminInfo = adminInfo;
        this.table = table;    
    }


    public insertData = async (req_params: any) => {
        let key : string = '';
        let value : string = '';

        for (let item in req_params) {
            key += ` ${item.toUpperCase()},`;
            value += ` '${req_params[item]}',`;
        }
        
        key = key.slice(0, key.length -1); //마지막 , 삭제
        value = value.slice(0, value.length -1); //마지막 , 삭제

        let query : string = `INSERT INTO ${this.table} (`
        query += ` ${key}`;
        query += ` ) VALUES (`;
        query += ` ${value}`;
        query += ` )`;
    
        const result: any = await this.database.query(query);
        return result;
    }

    public deleteData = async (req_params: any) => {
        let query : string = `DELETE FROM ${this.table} WHERE`
        let first_index: boolean = true;
        for (let item in req_params) {
            if (first_index) {
                query += ` ${item.toUpperCase()} = '${req_params[item]}'`
                first_index = false;
            } else {
                query += ` AND ${item.toUpperCase()} = '${req_params[item]}'`
            }
        };
    
        const result: any = await this.database.query(query);
        return result;
    }

    public updateData = async (req_params: any) => {
        let where_keys : any = {};
        let set : string = '';

        for (let item in req_params) {
            if (item.indexOf('KEY_') > -1) {    //조건으로 들어갈 key값은 'KEY_' 가 붙어있음
                where_keys[item.replace('KEY_', '')] = req_params[item];
                delete req_params[item];        //옮기고 삭제
            }
        }

        for (let item in req_params) {
            set += ` ${item.toUpperCase()} = '${req_params[item]}',`;
        }
        set = set.slice(0, set.length -1); //마지막 , 삭제

        let query : string = `UPDATE ${this.table} SET`
        query += ` ${set}`;
        if (Object.keys(where_keys).length > 0) {
            query += ` WHERE`
            let first_index: boolean = true;
            for (let item in where_keys) {
                if (first_index) {
                    query += ` ${item.toUpperCase()} = '${where_keys[item]}'`
                    first_index = false;
                } else {
                    query += ` AND ${item.toUpperCase()} = '${where_keys[item]}'`
                }    
            }
        }
        const result: any = await this.database.query(query);
        return result;
    }

    public duplicate = async (req_params: any) => {
        let duplication: string;
        for (let item in req_params) {
            duplication = `${item} = '${req_params[item]}'`;
        }
        let query : string = ` SELECT * FROM ${this.table} WHERE ${duplication}`
        const result: any = await this.database.query(query);
        return result;
    }

    public getCodeName = async (code : string, gubun : string, p_code : string | null) => {
        let query : string = `SELECT CODE_NM FROM TB_DEPT_DEPTH WHERE CODE = '${code}' AND GUBUN = '${gubun}'`;
        if (p_code !== null) {
            query += ` AND P_CODE= '${p_code}'`
        }
        const result : any = await this.database.query(query);
        return result;
    }

}
