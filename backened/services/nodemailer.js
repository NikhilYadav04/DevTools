import nodemailer from "nodemailer";
import env from "dotenv";

const pass = process.env.APP_PASS;

export const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "crrajdhani@gmail.com",
    pass: pass,
  },
});
