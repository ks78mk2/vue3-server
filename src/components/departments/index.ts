import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.get("/codeone", function(request, response) { //학교리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getCode01');
});            
router.get("/codetwo", function(request, response) { //학과리스트 가져오기 
    InterfaceRouter.apiBinding(request, response, Controller, 'getCode02');
});    
router.get("/dupl/codename", function(request, response) { //학교, 학교 이름 중복 확인
    InterfaceRouter.apiBinding(request, response, Controller, 'duplicate_codename');
});    
router.post("/codeone", function(request, response) { //학교리스트 생성 
    InterfaceRouter.apiBinding(request, response, Controller, 'insertCode01');
});    
router.post("/codetwo", function(request, response) { //학과리스트 생성
    InterfaceRouter.apiBinding(request, response, Controller, 'insertCode02');
});    
        
module.exports = router;
