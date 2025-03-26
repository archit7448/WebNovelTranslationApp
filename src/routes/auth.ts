import express, { Router } from "express";

function authRouter(router: Router) {
    router.post("/api/v1/auth/login", (_, res: express.Response) => {
        console.log("Logging in");
        res.send("Logged in");
    });
    router.post("/api/v1/auth/register", (_, res: express.Response) => {
        console.log("Registering");
        res.send("Registered");
    });
}

export default authRouter;
