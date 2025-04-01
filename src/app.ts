import express, { Application } from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authservice } from "./services/auth";
class App {
    private static instance: App | null;
    private app: Application;
    private authRoutes: AuthRoutes;

    private constructor() {
        this.app = express();
        this.authRoutes = AuthRoutes.getInstance();
        this.initializeMiddleware();
        this.initializeRoutes();
    }

    public static getInstance() {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    private initializeMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(morgan("tiny"));
    }

    private initializeRoutes(): void {
        this.app.use("/api/auth", this.authRoutes.getRouter());
        this.app.use(
            "/api/protected",
            authservice.isAuthenticated,
            (req: express.Request, res: express.Response) => {
                res.send("protected");
            },
        );
        this.app.use("/", (_, res: express.Response) => {
            res.send("Hello world!");
        });
    }

    public listen(): void {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

export default App;
