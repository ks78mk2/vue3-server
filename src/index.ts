import express, {Request, Response, NextFunction} from "express";
const app = express();
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import auth from "./libraries/middleware/auth";
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const server = require("../config/server.json")
import logger from "./libraries/util/logger";
const querystring = require('querystring');
const url = require('url');

let WebServer: any;
if (server[server.mode].SecureOnOff) {     // https
    const options = {
        key: fs.readFileSync(__dirname + '/../../ssl/test.com_key.pem'),
        cert: fs.readFileSync(__dirname + '/../../ssl/test.com_cert.pem'),
    };
    WebServer = https.createServer(options, app).listen(server[server.mode].port, function () {
        logger.info("Https server listening on port " + server[server.mode].port);
        console.log("Https server listening on port " + server[server.mode].port)
    });
} else {// http
    WebServer = http.createServer(app).listen(server[server.mode].port, function () {
        logger.info("Http server listening on port " + server[server.mode].port);
        console.log("Http server listening on port " + server[server.mode].port)
    });
}

const _io = require('./libraries/service/socket').initialize(WebServer);

app.use(cors());
app.use(helmet({
  noSniff: false
}));
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, '/../../public')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(compression());
app.use('/favicon.ico',  () => {});

//token 인증
app.use(auth);

//path log
app.use('/', (request: Request, response: Response, next: any) => {
  const userIP =  request.ip.indexOf(':') >= 0 ? request.ip.substring(request.ip.lastIndexOf(':') + 1) : request.ip
  logger.info(`[${userIP}] -> Path Change : ${request.method} ${request.originalUrl}`);

  next();
})

app.all('*', function (request: Request | any, response: Response, next: any) {
  let url_parts, sub, url_parts_nm;
  if (request.method == 'POST') {
      url_parts = querystring.stringify(request.body);
      url_parts_nm = url.parse(request.url, true).pathname;
  } else if (request.method == 'GET') {
      url_parts = url.parse(request.url, true);
      url_parts_nm = url_parts.pathname;
      url_parts = "" + url_parts.search;
      sub = url_parts.substr(1, 1);
  }

  if (typeof url_parts == "undefined" || url_parts.length == 0 || sub == "_" || url_parts_nm == "/alert/") {
      next();
  } else {
      let params = url_parts.substring(url_parts.indexOf('?') + 1, url_parts.length);
      params = params.split("&");
      logger.info("parameters : " + params);

      let value : any, weakWord;
      let returnVal = false;

      for (let i = 0; i < params.length; i++) {
          value = params[i].split("=")[1];
          
          var checkString = ['ONABORT', 'ONBLUR', 'ONCHANGE', 'ONCLICK', 'ONDBCLICK', 'ONERROR', 'ONFOCUS', 'ONKEYDOWN', 'ONKEYUP', 'ONKEYPRESS', 'ONLOAD', 'ONMOUSEDOWN', 'ONMOUSEMOVE', 'ONMOUSEOUT', 'ONMOUSEOVER', 'ONMOUSEUP', 'ONRESET', 'ONRESIZE', 'ONSELECT', 'ONSUBMIT', 'ONUNLOAD', 'ONFILTERCHANGE', 'ONDRAGDROP', 'EXPRESSION', 'ONMOVE', 'ONSTART', 'ONMOUSEENTER', 'ONPLAYING', 'ONCANPLAY', 'ONSCROLL', 'JAVASCRIPT', 'VBSCRIPT', 'sys.user$', 'all_users', 'session_privs', 'dba_sys_privs', 'all_', 'sys.tab', 'SYSAUX', 'user_tables', 'master..', 'syscolumns', 'sysobjects', 'sys.sql_logins', '_name', 'information_schema', 'dbms_lock', '.sleep', 'UTL_', '.get_host_name', '.get_host_address', '.REQUEST', 'to_', 'SYS.DATABASE_NAME', 'chartorowid', 'hextoraw', 'username', 'sys_', 'userenv', 'user_name', 'is_srvrolemember', 'TYPE_NAME', 'HOST_NAME', 'quotename', 'sp_', 'xp_cmdshell', 'SERVERNAME', 'SYSTEM_USER', 'procedure', 'session_user', 'group_concat', 'concat_ws', 'ifnull', '../', '/']

          let checkresult = checkString.find((item : any) => {return item === value})
          if (checkresult != undefined) {
              weakWord = decodeURIComponent(value);
              returnVal = true;
          }
      }
      if (!returnVal) {
          next();
      } else {
        const userIP =  request.ip.indexOf(':') >= 0 ? request.ip.substring(request.ip.lastIndexOf(':') + 1) : request.ip
        const msg = "금칙어 [" + weakWord + "]가 검출되어 로그아웃 되었습니다."
        logger.info('Security vulnerability IP : ' + userIP + ' > ' + msg)
        _io.sockets.emit('logout', request.decoded.admin_id, msg);
      }
  }
});

function nocache(req: Request, res: Response, next: any) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}
//router components
app.use("/api/v1/users", nocache, require("./components/users"));    // 로그인, 계정등록 등
app.use("/api/v1/departments", nocache, require("./components/departments")); // 학교, 학과 등
app.use("/api/v1/reports", nocache, require("./components/reports"));  // 이력 조회
app.use("/api/v1/controls", nocache, require("./components/controls"));  // 채널(시험) 요청 및 수정 등
app.use("/api/v1/onlines", nocache, require("./components/onlines"));  // 현황 리스트
app.use("/api/v1/commons", nocache ,require("./components/commons"));  // 썸네일 등
app.use("/api/v1/subscriptions", nocache ,require("./components/subscriptions"));  // 개통 관련
app.use("/api/v1/qnas", nocache ,require("./components/qnas"));  // 문의
app.use("/api/v1/pcview", nocache ,require("./components/pcview"));  // pcviewer 연동 api
app.use("/api/v1/analyze", nocache ,require("./components/analyze"));  // 통합분석 api
app.use("/api/v1/choice", nocache ,require("./components/choice"));  // viewer choice api



//404 Error
app.use(function(request: Request, response: Response, next: any) {     
  const userIP =  request.ip.indexOf(':') >= 0 ? request.ip.substring(request.ip.lastIndexOf(':') + 1) : request.ip
  logger.error(`[${userIP}] -> Path : ${request.originalUrl} : 404 not found`);         
  response.status(404).json({message: "Sorry can't find that!"});
});

process.on('uncaughtException', function (err) {
	//예상치 못한 예외 처리
	logger.error(`uncaughtException -> ${err}`);   
});

exports._io = _io;