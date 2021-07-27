import express from "express";
const router = express.Router();
import Controller from "./controller";
import { existsSync, mkdirSync } from "fs";
const multer = require("multer")
import InterfaceRouter from "../interface/router"
import logger from "../../libraries/util/logger";

if (!existsSync(__dirname + '/../../../../public/uploads')) mkdirSync(__dirname + '/../../../../public/uploads'); //폴더가 없을 경우 생성

const storage : any = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        logger.info(__dirname + '/../../../../public/uploads')
      cb(null, __dirname + '/../../../../public/uploads') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req: any, file: any, cb: any) {
        if (file != undefined) {
            cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
        } else {
            cb(null, '') 
        }      
    }
  })
const upload: any = multer({storage: storage})

router.get("/thumb", function(request, response) { //썸네일 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'thumbView');
});                    
router.get("/logo", function(request, response) { //썸네일 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'logoDownload');
});                    
router.get("/thumb/download", function(request, response) { //썸네일 다운로드
    InterfaceRouter.apiBinding(request, response, Controller, 'thumbDownload');
});                    
router.get("/app/download", function(request, response) { //app 다운로드
    InterfaceRouter.apiBinding(request, response, Controller, 'appDownload');
});                    
router.get("/download", function(request, response) { //파일 다운로드
    InterfaceRouter.apiBinding(request, response, Controller, 'vodDownload');
});                    
router.get("/sendmail", function(request, response) { //메일 전송
    InterfaceRouter.apiBinding(request, response, Controller, 'sendmail');
});         
router.get("/liveview/address", function(request, response) { //뷰어 실행 address 정보 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getLiveviewAddress');
});           
router.post("/uploadfile", upload.single('THUMBNAIL'), function(request, response) { //썸네일 업로드 
    InterfaceRouter.apiBinding(request, response, Controller, 'uploadFile');
});           

module.exports = router;
