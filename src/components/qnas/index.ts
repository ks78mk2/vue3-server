import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.post("/qna", function(request, response) { //문의하기
    InterfaceRouter.apiBinding(request, response, Controller, 'insertData');
});            
router.get("/list", function(request, response) { //신청현황 리스트
    InterfaceRouter.apiBinding(request, response, Controller, 'getQNAList');
});            
router.get("/count", function(request, response) { //신청현황 갯수
    InterfaceRouter.apiBinding(request, response, Controller, 'getQNACount');
});            
router.delete("/qna/:qno", function(request, response) { //delete
    InterfaceRouter.apiBinding(request, response, Controller, 'deleteData');
}); 

module.exports = router;
