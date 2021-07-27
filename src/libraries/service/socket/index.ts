
import logger from "../../util/logger"
const socketIO = require('socket.io')
const struct = require('../coupledMessage');
// const socketClient = require('../socketClient');
let io : any = null;
import db from '../../database/dbConfig';
const server = require('../../../../config/server.json');
const dbConn = new db(`${server[server.mode].host}:${server[server.mode].port}`);

// const client = socketClient.client;

exports.io = function () {
    return io;
};

exports.initialize = function (server: any) {
    try { 
        io = socketIO(server);
        io.set({'transports': ['polling'], upgrade: false});

        io.on('connection', function (socket: any) {
            socket.on('disconnect', function () {
                logger.info(socket.id + ' has disconnected from the chat.');
            });

        });
        return io;

    } catch (error) {
        logger.error("Socket Error: ", error);
    }
};