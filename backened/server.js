import express from "express";
import cors from "cors";
import env from "dotenv";
import { router } from "./config/router_config.js";
import { authRouter } from "./routes/auth.js";
import connectDB from "./services/connectDB.js";
import { historyRouter } from "./routes/history.js";
import { scanRouter } from "./routes/scan.js";
import { notifyRouter } from "./routes/notify.js";


const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.DB;

//* Middleware
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//* define express router
app.use(router);

router.use("/auth", authRouter);
router.use("/history",historyRouter);
router.use("/scan",scanRouter);
router.use("/notify",notifyRouter);

//* Basic route
app.get("/", (req, res) => {
  res.send("Server is running on port 3000");
});

//* Connect to DB
connectDB();

//* Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
