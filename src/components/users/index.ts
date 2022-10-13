import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.post("/signin", function(request, response) { //로그인
    InterfaceRouter.apiBinding(request, response, Controller, 'signin');
});                        
router.post("/signout", function(request, response) { //로그아웃
    InterfaceRouter.apiBinding(request, response, Controller, 'signout');
});    
router.get("/check", function(request, response) { //아이디 중복 체크
    InterfaceRouter.apiBinding(request, response, Controller, 'duplicate');
});    
router.get("/email/exist", function(request, response) { //이메일 존재유무 체크
    InterfaceRouter.apiBinding(request, response, Controller, 'email_existence');
});    
router.get("/pass/init", function(request, response) { //패스워드 초기화
    InterfaceRouter.apiBinding(request, response, Controller, 'passInit');
});    
router.get("/list", function(request, response) { //유저 리스트 불러오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getUserList');
});     
router.post("/user", function(request, response) { //계정생성
    InterfaceRouter.apiBinding(request, response, Controller, 'userInsertData');
});
router.post("/pass/check", function(request, response) { //패스워드 check
    InterfaceRouter.apiBinding(request, response, Controller, 'passCheck');
});    
router.put("/user/:admin_id", function(request, response) { //수정
    InterfaceRouter.apiBinding(request, response, Controller, 'userUpdateData');
});
router.delete("/user/:admin_id", function(request, response) { //삭제
    InterfaceRouter.apiBinding(request, response, Controller, 'deleteData');
});
        
module.exports = router;
