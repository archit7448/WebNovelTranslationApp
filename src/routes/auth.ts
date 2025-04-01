import { Router } from "express";
import { authservice } from "src/services/auth";

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
        this.router.post("/login", authservice.login);
        this.router.get("/verify", authservice.verify);
        this.router.post("/register", authservice.register);
        this.router.post(
            "/resend-verification",
            authservice.resendVerificationEmail,
        );
    }
    public getRouter() {
        return this.router;
    }
}

export default AuthRoutes;
