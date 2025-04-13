import express from "express";
import {
  clear_history,
  delete_history,
  get_history,
  scan_all,
  store,
} from "../controller/history.js";

export const historyRouter = express.Router();
historyRouter.use(express.json());

//* Store searched websites in user history
historyRouter.post("/store", store);

//* get user history
historyRouter.get("/get",get_history)

//* Delete a specific website from history
historyRouter.delete("/delete", delete_history);

//* clear history
historyRouter.delete("/clear", clear_history);

//* Scan all previously stored websites for a user
historyRouter.post("/scan_al", scan_all);
