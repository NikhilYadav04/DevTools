import express from "express";
import { login, register } from "../controller/auth.js";

export const authRouter = express.Router();
authRouter.use(express.json());

//* register route
authRouter.post("/register", register);

//* login route
authRouter.post("/login", login);

