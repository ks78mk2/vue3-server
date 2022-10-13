const net = require('net');
const merge = require('merge');
import logger from "../../util/logger"
const server = require('../../../../config/server.json');
import db from '../../database/dbConfig';
const struct = require('../coupledMessage');
const dbConn = new db(`${server[server.mode].host}:${server[server.mode].port}`)
import DateConvert from '../../util/date'


const socket = new net.Socket();
const appServerIP: string = '127.0.0.1';
const appServerPort: number = 12345;
const _io: any = require('../../../index')

let client: any;
const retryInterval: number = 3000;
let retriedTimes: number = 0;
const maxRetries: number = 10;


(function connect() {
    function reconnect() {
        if (retriedTimes >= maxRetries) {
            throw new Error('retriedTimes > maxRetries');
        }
        retriedTimes += 1;
        setTimeout(connect, retryInterval);
    }
    const svip = {
        port: appServerPort,
        host: appServerIP,
    };
    client = socket.connect(svip, function () {
        logger.info('App Server tcp connected success');
    });

    client.on('connect', function () {

        retriedTimes = 0;
        logger.info('connect event emit');
    });

    client.on('data', function (data: any) {
        logger.info('Noti message ocurred!');

        parsingMessage(data);
    });

    client.on('close', function () {
        logger.error('Connection closed');

        reconnect();
    });

    client.on('error', function (err: any) {
        logger.error('connect error', err);
    });
}());


const parsingMessage = (data: any) => {
    try {
        struct.parsingBodyData(data, async function (error: any, header:any, body: any, unProcessedBuf: any) {
            if (error) {
                throw error;
            } else {
                switch (header.commend) { //중계서버 이벤트 수신
                    case 'B101' :   // 영상시작 시 휴대전화, 디바이스 아이디 정보 전송
                        break;
                    case 'B302' :   // VIEW 정보 전송
                        break;
                    case 'B600' :   // 서비스 종료 
                        break;
                    case 'B70X' :   // 테이블 변경 noti
                        break;
                    default:
                        const protocolMsg = merge(header, body);
                        _io.sockets.emit(header.command, protocolMsg);
                        break;
                }
            }            
        })
    } catch (error) {
        logger.error('Socket Client Error:', error)
    }
}

exports.client = client;
