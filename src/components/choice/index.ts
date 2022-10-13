import express from "express";
const router = express.Router();
import Controller from "./controller";
import InterfaceRouter from "../interface/router"

router.post("/view", function(request, response) { //view choice
    InterfaceRouter.apiBinding(request, response, Controller, 'postViewChoice');
});
module.exports = router;
