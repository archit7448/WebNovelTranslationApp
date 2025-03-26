import express, { Router } from "express";

class AuthRoutes {
    private static instance: AuthRoutes | null;
    private router: Router;
    private constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    public static getInstance(): AuthRoutes {
        if (!AuthRoutes.instance) {
            AuthRoutes.instance = new AuthRoutes();
        }
        return AuthRoutes.instance;
    }

    private initializeRoutes(): void {
        this.router.post("/login", (_, res: express.Response) => {
            console.log("Request on Login route");
            res.send("Logged in");
        });
        this.router.post("/register", (_, res: express.Response) => {
            console.log("Request on register route");
            res.send("Registered in");
        });
    }
    public getRouter() {
        return this.router;
    }
}

export default AuthRoutes;
