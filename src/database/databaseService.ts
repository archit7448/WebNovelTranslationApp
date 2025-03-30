/** 3P Package */
import {
    createClient,
    PostgrestError,
    SupabaseClient,
} from "@supabase/supabase-js";
import dotenv from "dotenv";

// Database Table Names
export const DB_TABLES = {
    USERS: "users",
} as const;

// Database Column Names
export const USER_COLUMNS = {
    ID: "id",
    NAME: "name",
    EMAIL: "email",
    VERIFIED: "verified",
    CREATED_AT: "created_at",
} as const;

// Type for User columns
export type UserColumns = keyof typeof USER_COLUMNS;

interface User {
    [USER_COLUMNS.ID]?: string;
    [USER_COLUMNS.NAME]: string;
    [USER_COLUMNS.EMAIL]: string;
    [USER_COLUMNS.VERIFIED]: boolean;
    [USER_COLUMNS.CREATED_AT]?: Date;
}

class DatabaseService {
    private static instance: DatabaseService | null = null;
    private supabase: SupabaseClient;

    private constructor() {
        dotenv.config();
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase credentials");
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    // User Operations
    async createUser(userData: User) {
        try {
            const { data, error } = await this.supabase
                .from(DB_TABLES.USERS)
                .insert([userData])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getUserByEmail(
        email: string,
    ): Promise<{ data: User | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await this.supabase
                .from(DB_TABLES.USERS)
                .select("*")
                .eq(USER_COLUMNS.EMAIL, email)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getUserById(id: string) {
        try {
            const { data, error } = await this.supabase
                .from(DB_TABLES.USERS)
                .select("*")
                .eq(USER_COLUMNS.ID, id)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async updateUser(id: string, userData: Partial<User>) {
        try {
            const { data, error } = await this.supabase
                .from(DB_TABLES.USERS)
                .update(userData)
                .eq(USER_COLUMNS.ID, id)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Update user error:", error);
            return { data: null, error };
        }
    }

    async deleteUser(id: string) {
        try {
            const { data, error } = await this.supabase
                .from(DB_TABLES.USERS)
                .delete()
                .eq(USER_COLUMNS.ID, id);

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
    getClient() {
        return this.supabase;
    }
}

export default DatabaseService;
