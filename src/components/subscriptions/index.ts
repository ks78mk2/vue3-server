import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.post("/subscription", function(request, response) { //상품구매 신청
    InterfaceRouter.apiBinding(request, response, Controller, 'subInsertData');
});            
router.put("/subscription/:admin_id/:insert_date", function(request, response) { //수정
    InterfaceRouter.apiBinding(request, response, Controller, 'updateData');
});            
router.get("/list", function(request, response) { //신청현황 리스트
    InterfaceRouter.apiBinding(request, response, Controller, 'getSubscriptionList');
});            
router.get("/count", function(request, response) { //신청현황 갯수
    InterfaceRouter.apiBinding(request, response, Controller, 'getSubscriptionCount');
});            
router.get("/admin", function(request, response) { //교수정보 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getAdminInfo');
});            
router.delete("/subscription/:admin_id/:insert_date", function(request, response) { //delete
    InterfaceRouter.apiBinding(request, response, Controller, 'deleteData');
}); 

module.exports = router;
