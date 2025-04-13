import express from "express";
import { ask, website } from "../controller/scan.js";

export const scanRouter = express.Router();
scanRouter.use(express.json());

//*  Route to scan a website link scan a website link
scanRouter.post("/website", website);

//* Route to ask for replacement links from Gemini AI
scanRouter.post("/ask", ask);
