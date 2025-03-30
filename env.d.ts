// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from "express";
// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        DATABASE_URL: string;
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}
