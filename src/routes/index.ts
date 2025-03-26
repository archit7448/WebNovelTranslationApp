import express from "express";
import authRouter from "./auth";

const router = express.Router();
router.get("/", (_, res: express.Response) => {
    res.send("Home Page");
});

authRouter(router);

export default router;
