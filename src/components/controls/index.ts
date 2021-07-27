import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.get("/list", function(request, response) { //채널 리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getChannelList');
});            
router.get("/count", function(request, response) { //채널 리스트 갯수 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getChannelCount');
});            
router.get("/dupl/starttime", function(request, response) { //채널 중복확인
    InterfaceRouter.apiBinding(request, response, Controller, 'duplicate_time');
});            
router.get("/dupl/code", function(request, response) { //코드 중복확인
    InterfaceRouter.apiBinding(request, response, Controller, 'duplicate');
});            
router.get("/report/channel", function(request, response) { //끝난 시험과목 리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getReportChannel');
});     
router.get("/online/channel", function(request, response) { //남은 시험과목 리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getOnlineChannel');
});     
router.get("/online/channel/info", function(request, response) { //채널 정보 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getChannelInfo');
});       
router.put("/channel/:seq", function(request, response) { //update
    InterfaceRouter.apiBinding(request, response, Controller, 'updateData');
});   
router.delete("/channel/:seq", function(request, response) { //delete
    InterfaceRouter.apiBinding(request, response, Controller, 'deleteData');
});   
router.post("/channel", function(request, response) { //insert
    InterfaceRouter.apiBinding(request, response, Controller, 'ControlInsertData');
});   

module.exports = router;
