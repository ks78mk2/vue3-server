import express from "express";
const router = express.Router();
import Controller from "./controller";
import { existsSync, mkdirSync } from "fs";
const multer = require("multer")
import InterfaceRouter from "../interface/router"

if (!existsSync(__dirname + '/../../../../public/excel')) mkdirSync(__dirname + '/../../../../public/excel'); //폴더가 없을 경우 생성

const storage : any = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, __dirname + '/../../../../public/excel') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req: any, file: any, cb: any) {
        if (file != undefined) {
            cb(null, 'analyzeCapture.jpg') // cb 콜백함수를 통해 전송된 파일 이름 설정
        } else {
            cb(null, '') 
        }      
    }
  })
const upload: any = multer({storage: storage})

router.get("/list", function(request, response) { //리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getReportList');
});                      
router.post("/excel/analyze", upload.single('ANALYZE'), function(request, response) { //엑셀 다운로드
    InterfaceRouter.apiBinding(request, response, Controller, 'analyzeExcelDownload');
});                      
router.get("/excel/student", function(request, response) { //엑셀 다운로드
    InterfaceRouter.apiBinding(request, response, Controller, 'studentExcelDownload');
});                      
router.get("/download/media", function(request, response) { //vod, img 다운로드
    InterfaceRouter.apiBinding(request, response, Controller, 'mediaDownload');
});                                       
module.exports = router;
