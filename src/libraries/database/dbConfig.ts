import mysql from "mysql";
import ClientError from "../error/clientError";
import MySqlError from "./mysqlError";
import server from "../../../config/server.json";
import logger from "../util/logger";


const dbserver: any = server;
const pool = mysql.createPool({
  host: dbserver[dbserver.mode].db.host,
  port: dbserver[dbserver.mode].db.port,
  user: '',
  password: '',
  database: ''
});

export default class Database {
  private ip : string;
  constructor(ip: string) {
    const userIP =  ip.indexOf(':') >= 0 ? ip.substring(ip.lastIndexOf(':') + 1) : ip;
    this.ip = userIP;
  }
  public query = (querystring: string) => {
    logger.info(`[${this.ip}] -> Query : ${querystring}`); 
    return new Promise(function(resolve: any, reject: any) {
      pool.getConnection((error, con) => {
        con.query(querystring, (error, data) => {
          con.release();
          if (error) {
            if (error.code === "ER_ACCESS_DENIED_ERROR") {
              // getConnection failed
              let error = new MySqlError(this.ip,"0000");
              reject(error);
            } else if (error.code === "ER_PARSE_ERROR") {
              // query parsing failed
              let error = new MySqlError(this.ip, "0001");
              reject(error);
            } else if (error.code === "ER_DUP_ENTRY") {
              // duplicate entry
              let error = new MySqlError(this.ip, "0002");
              reject(error);
            } else {
              // other errors
              let error = new MySqlError(this.ip, "9999");
              reject(error);
            }
          } else {
            resolve(data);
          }
        });
      });
    }.bind(this));
  };
}
