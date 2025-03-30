import { AuthSession, UserResponse } from "@supabase/supabase-js";
import express, { NextFunction } from "express";
import { User } from "@supabase/supabase-js"; // Import User type
import DatabaseService from "src/database/databaseService";

class AuthService {
    private static instance: AuthService | null = null;
    private db: DatabaseService = DatabaseService.getInstance();

    register = async (req: express.Request, res: express.Response) => {
        const { email, password }: { email: string; password: string } =
            req.body;

        const { data: existingUser } = await this.db.getUserByEmail(email);

        if (existingUser) {
            res.json({
                message: "User alreadt exist",
            });
            return;
        }

        const { data, error } = await this.db.getClient().auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "http://localhost:3000/api/auth/verify",
            },
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const { error: userError } = await this.db.createUser({
            id: data.user?.id,
            email,
            name: req.body.name || "Unknown",
            verified: false,
        });

        if (userError) {
            console.log(userError);
            res.status(400).json({ error });
            return;
        }

        res.status(200).json({
            message: "Signup successful. Please verify your email.",
        });
    };

    login = async (req: express.Request, res: express.Response) => {
        const { email, password } = req.body;
        const { data, error } = await this.db
            .getClient()
            .auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }
        await this.db.updateUser(data.session.user.id, { verified: true });
        // Calculate expiration time in milliseconds
        const accessTokenExpiry = new Date(
            (data.session.expires_at as number) * 1000,
        );

        // Store tokens in HTTP-only cookies with correct expiry
        res.cookie("accessToken", data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: accessTokenExpiry, // Set expiry
        });

        res.cookie("refreshToken", data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
        });

        res.status(200).json({ message: "Login successful" });
    };

    // Not done yet
    async verify(req: express.Request, res: express.Response) {
        const accessToken = req.query.access_token as string;
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.redirect("/");
        return;
    }

    resendVerificationEmail = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const { email } = req.body;

        // Check if user exists
        const { data: existingUser } = await this.db.getUserByEmail(email);

        if (!existingUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Resend the email using Supabase Auth
        const { error } = await this.db.getClient().auth.resend({
            type: "signup",
            email,
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({
            message: "Verification email resent successfully",
        });
        return;
    };

    isAuthenticated = async (
        req: express.Request,
        res: express.Response,
        next: NextFunction,
    ) => {
        let accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        let currUser: UserResponse = {
            data: { user: {} as User },
            error: null,
        };
        if (!accessToken) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Validate access token
        const { error } = await this.db.getClient().auth.getUser(accessToken);

        if (error) {
            // If access token is invalid, try refreshing it
            if (!refreshToken) {
                res.status(401).json({
                    error: "Unauthorized - No refresh token",
                });
                return;
            }

            // Attempt to refresh the token
            const refreshResponse = await this.db
                .getClient()
                .auth.refreshSession({ refresh_token: refreshToken });

            if (refreshResponse.error) {
                res.status(401).json({
                    error: "Unauthorized - Token refresh failed",
                });
                return;
            }

            // Get new session details
            const newSession = refreshResponse.data.session as AuthSession;
            accessToken = newSession.access_token;

            // Update cookies with new access token
            res.cookie("accessToken", newSession.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date((newSession.expires_at as number) * 1000),
            });

            res.cookie("refreshToken", newSession.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // Assuming 30 days expiry
            });

            // Get user details with the new access token
            currUser = await this.db.getClient().auth.getUser(accessToken);
        } else {
            currUser = await this.db.getClient().auth.getUser(accessToken);
        }

        // Attach user info to request object

        req.user = { id: currUser.data.user?.id as string };

        next();
    };

    public static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
}

export const authservice = AuthService.getInstance();
export default AuthService;
