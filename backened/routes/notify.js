import express from "express";
import { send_email,schedule } from "../controller/notify.js";
export const notifyRouter = express.Router();
notifyRouter.use(express.json());

//* send email
notifyRouter.post("/send-email", send_email);

//* cron_job notify
notifyRouter.post("/schedule",schedule)
