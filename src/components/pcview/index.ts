import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.get("/bookmarklist", function(request, response) { //리스트 가져오기
    InterfaceRouter.apiBinding(request, response, Controller, 'getBookmarkList');
});
router.put("/bookmarkdel", function(request, response) { //북마크 삭제(hide)
    InterfaceRouter.apiBinding(request, response, Controller, 'hideBookmark');
});
router.post("/bookmarkadd", function(request, response) { //북마크 삭제(hide)
    InterfaceRouter.apiBinding(request, response, Controller, 'bookmarkInsert');
});
module.exports = router;
