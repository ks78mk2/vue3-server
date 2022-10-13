import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.get("/count", function(request, response) { //통합분석 Count 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getAnalyzeCount');
});                      
router.get("/list", function(request, response) { //통합분석 체크필요 대상 인원 리스트
    InterfaceRouter.apiBinding(request, response, Controller, 'getAnalyzeList');
});    
router.put("/:cust_ctn/:code_id", function(request, response) { //수정
    InterfaceRouter.apiBinding(request, response, Controller, 'updateData');
})                                                    
module.exports = router;
