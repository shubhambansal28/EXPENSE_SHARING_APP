import express from "express";
import c from "./helpers/controllerHandler.js";
import controller from "./controller.js";


export const appRouter = express.Router();

appRouter.route("/createUser").post(
    c(controller.createUser, (req, res) => [
        req.body
    ])
);

appRouter.route("/addMembers").post(
    c(controller.addMembers, (req, res) => [
        req.body
    ])
);

appRouter.route("/payBill").post(
    c(controller.payBill, (req, res) => [
        req.body
    ])
);

appRouter
    .route("/splitBill").post(
        c(controller.splitBill, (req, res) => [
            req.body
        ])
    );

appRouter.route("/userbalancestatus").post(
    c(controller.balanceStatus, (req, res) => [
        req.body
    ])
);