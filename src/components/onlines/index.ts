import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.get("/list", function(request, response) { //리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getOnlineList');
});                                                                                     
router.delete("/online/:code_id", function(request, response) { //user status 삭제
    InterfaceRouter.apiBinding(request, response, Controller, 'deleteData');
});                                                
module.exports = router;
