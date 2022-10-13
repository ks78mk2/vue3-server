import { fstat, unlink, createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import logger from "../../libraries/util/logger";
import CommonError from "./error";
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service : "whoismail",
    host : "smart.whoismail.net",
    port : 587,
    secure : false,
    auth : {
        user : "admin@liveseeyou.com",
        pass : "1qaz2wsx#EDC"
    }
})

export default class InnerFunction {
    static sendmail = async function (mailOptions: any, ip : string) {
        try {
            let info = await transporter.sendMail(mailOptions);   
            logger.info('mail send success');
            return '메일을 전송하였습니다.'
        } catch (error) {
            logger.info('mail error :'+ error)
            let err = new CommonError(ip, "0002");
            return err
        }        
    };

    static moveFile = async function (oldPath: string, newPath: string, ip: string) {
        return new Promise(async function(resolve: any, reject: any) {

            let readStream = createReadStream(oldPath);
            let writeStream = createWriteStream(newPath);

            readStream.on('error', function(err) {
                logger.info("read error!!!!")
                reject(new CommonError(ip, "0012"));
            });
            writeStream.on('error', function(err) {
                logger.info("write error!!!!")
                reject(new CommonError(ip, "0012"));
            });

            readStream.on('close', function () {
                unlink(oldPath, ()=> {
                    resolve('성공')
                });       
            });

            readStream.pipe(writeStream);
        })
    };
}