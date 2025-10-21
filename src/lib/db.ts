import { promises as fs } from 'fs';
import path from 'path';

export interface UserSession {
    userId: string;
    email: string;
    name: string;
    picture?: string;
    refreshToken: string;
    accessToken?: string;
    tokenExpiry?: number;
    createdAt: number;
    updatedAt: number;
}

/**
 * Simple file-based database for storing user sessions and tokens
 * Uses JSON file storage for simplicity - can be migrated to PostgreSQL/MongoDB later
 */
class Database {
    private static instance: Database;
    private dataDir: string;
    private sessionsFile: string;

    private constructor() {
        this.dataDir = path.join(process.cwd(), 'data');
        this.sessionsFile = path.join(this.dataDir, 'sessions.json');
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Initialize database directory and files
     */
    private async initialize(): Promise<void> {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });

            // Create sessions file if it doesn't exist
            try {
                await fs.access(this.sessionsFile);
            } catch {
                await fs.writeFile(this.sessionsFile, JSON.stringify({}, null, 2));
            }
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    /**
     * Read sessions from file
     */
    private async readSessions(): Promise<Record<string, UserSession>> {
        await this.initialize();

        try {
            const data = await fs.readFile(this.sessionsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to read sessions:', error);
            return {};
        }
    }

    /**
     * Write sessions to file
     */
    private async writeSessions(sessions: Record<string, UserSession>): Promise<void> {
        await this.initialize();

        try {
            await fs.writeFile(this.sessionsFile, JSON.stringify(sessions, null, 2));
        } catch (error) {
            console.error('Failed to write sessions:', error);
            throw error;
        }
    }

    /**
     * Create or update user session
     */
    public async saveSession(session: UserSession): Promise<void> {
        const sessions = await this.readSessions();
        sessions[session.userId] = {
            ...session,
            updatedAt: Date.now(),
        };
        await this.writeSessions(sessions);
    }

    /**
     * Get user session by ID
     */
    public async getSession(userId: string): Promise<UserSession | null> {
        const sessions = await this.readSessions();
        return sessions[userId] || null;
    }

    /**
     * Get user session by email
     */
    public async getSessionByEmail(email: string): Promise<UserSession | null> {
        const sessions = await this.readSessions();

        for (const session of Object.values(sessions)) {
            if (session.email === email) {
                return session;
            }
        }

        return null;
    }

    /**
     * Delete user session
     */
    public async deleteSession(userId: string): Promise<void> {
        const sessions = await this.readSessions();
        delete sessions[userId];
        await this.writeSessions(sessions);
    }

    /**
     * Update access token for user
     */
    public async updateAccessToken(
        userId: string,
        accessToken: string,
        expiryTime: number
    ): Promise<void> {
        const sessions = await this.readSessions();

        if (sessions[userId]) {
            sessions[userId].accessToken = accessToken;
            sessions[userId].tokenExpiry = expiryTime;
            sessions[userId].updatedAt = Date.now();

            await this.writeSessions(sessions);
        }
    }
}

export const db = Database.getInstance();
