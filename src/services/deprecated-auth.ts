// import express from "express";
// import jwt from "jsonwebtoken";
// import DatabaseService, { USER_COLUMNS } from "src/database/databaseService";
// import bcrypt from "bcrypt";

// class AuthService {
//     private jwtSecret = Bun.env.JWT_SECRET as string;
//     private expiresIn: string | number;
//     private static instance: AuthService | null = null;
//     private constructor(expiresIn: string | number) {
//         this.expiresIn = expiresIn;
//     }

//     private signToken(id: string, email: string) {
//         return jwt.sign({ id, email }, Bun.env.JWT_SECRET, {
//             expiresIn: this.expiresIn as number,
//         });
//     }

//     register = async (req: express.Request, res: express.Response) => {
//         const email = req.body.email;
//         const password = req.body.password;
//         const name = req.body.name;
//         if (!email || !password) {
//             res.status(400).json({
//                 message: "Please provide email and password",
//             });
//             return;
//         }
//         const result =
//             await DatabaseService.getInstance().getUserByEmail(email);

//         if (result.data) {
//             res.status(400).json({ message: "User already exist" });
//             return;
//         }

//         const hashedPassword = await bcrypt.hash(password, 12);

//         const newUser = await DatabaseService.getInstance().createUser({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         newUser.data[USER_COLUMNS.PASSWORD] = undefined;

//         const accessToken = this.signToken(
//             newUser.data[USER_COLUMNS.ID],
//             newUser.data[USER_COLUMNS.EMAIL],
//         );

//         res.cookie("accessToken", accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//         });

//         res.status(200).json({ message: "Logged in", data: newUser.data });
//         return;
//     };

//     login = async (req: express.Request, res: express.Response) => {
//         try {
//             const email: string = req.body.email;
//             const password: string = req.body.password;

//             if (!email || !password) {
//                 res.status(400).json({
//                     message: "Please provide email and password",
//                 });
//                 return;
//             }
//             const result =
//                 await DatabaseService.getInstance().getUserByEmail(email);

//             if (!result.data) {
//                 res.status(400).json({ message: "Invalid email or password" });
//                 return;
//             }

//             const isPasswordCorrect = await bcrypt.compare(
//                 password,
//                 result.data.password,
//             );
//             if (!isPasswordCorrect) {
//                 res.status(400).json({ message: "Invalid email or password" });
//                 return;
//             }

//             if (!this.jwtSecret) {
//                 throw new Error("JWT secret is not defined.");
//                 return;
//             }

//             const accessToken = this.signToken(
//                 result.data[USER_COLUMNS.ID] as string,
//                 result.data[USER_COLUMNS.EMAIL],
//             );

//             res.cookie("accessToken", accessToken, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: "strict",
//             });

//             res.status(200).json({ message: "Logged in" });
//             return;
//         } catch (error) {
//             console.error("Login error:", error);
//             res.status(500).json({ message: "Internal Server Error" });
//         }
//     };

//     public static getInstance() {
//         if (!AuthService.instance) {
//             AuthService.instance = new AuthService("24h");
//         }
//         return AuthService.instance;
//     }
// }

// export default AuthService;
