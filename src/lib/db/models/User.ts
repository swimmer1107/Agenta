import { getDb, safeObjectId } from '../mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { JsonDB } from '../../db/local-store'; // Import local store

export interface UserSettings {
    theme: 'dark' | 'light';
    temperature: number;
    verbosity: 'simple' | 'detailed';
    model: string;
}

export interface User {
    _id?: ObjectId | string; // Allow string IDs for local store
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    settings?: UserSettings;
}

// Flag to force local storage if MongoDB fails consistently
const FORCE_LOCAL_STORAGE = true; // Temporary override to fix user issue immediately

export async function createUser(email: string, password: string, name: string): Promise<User> {
    try {
        console.log('🔄 Creating user:', email);

        let users;
        // Try MongoDB if explicitly requested, otherwise default to local for stability
        if (!FORCE_LOCAL_STORAGE) {
            try {
                const db = await getDb();
                users = db.collection<User>('users');
            } catch (e) {
                console.log('⚠️ MongoDB unavailable, falling back to Local JSON Store');
                users = JsonDB.users;
            }
        } else {
            console.log('📝 Using Local JSON Store (Forced)');
            users = JsonDB.users;
        }

        const normalizedEmail = email.toLowerCase();

        // Check if user already exists
        const existingUser = await (users as any).findOne({ email: normalizedEmail });

        if (existingUser) {
            console.log('⚠️ User already exists:', normalizedEmail);
            throw new Error('User already exists');
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);

        const user: User = {
            email: normalizedEmail,
            password: hashedPassword,
            name,
            createdAt: new Date(),
            settings: {
                theme: 'dark',
                temperature: 0.7,
                verbosity: 'detailed',
                model: 'GPT-4o (Recommended)'
            }
        };

        console.log('💾 Inserting user into database...');
        const result = await (users as any).insertOne(user);

        console.log('✅ User created successfully:', result.insertedId);
        return { ...user, _id: result.insertedId };
    } catch (error: any) {
        console.error('❌ Error creating user:', error.message);
        throw error;
    }
}

export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        console.log('🔍 Finding user by email:', email);

        let users;
        if (!FORCE_LOCAL_STORAGE) {
            try {
                const db = await getDb();
                users = db.collection<User>('users');
            } catch (e) {
                users = JsonDB.users;
            }
        } else {
            users = JsonDB.users;
        }

        const user = await (users as any).findOne({ email: email.toLowerCase() });

        if (user) {
            console.log('✅ User found:', email);
        } else {
            console.log('⚠️ User not found:', email);
        }

        return user;
    } catch (error: any) {
        console.error('❌ Error finding user:', error.message);
        try {
            const user = JsonDB.users.findOne({ email: email.toLowerCase() });
            return user as User | null;
        } catch (e) {
            throw error;
        }
    }
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
    try {
        console.log('🔐 Verifying password for user:', user.email);
        const isValid = await bcrypt.compare(password, user.password);
        console.log(isValid ? '✅ Password valid' : '❌ Password invalid');
        return isValid;
    } catch (error: any) {
        console.error('❌ Error verifying password:', error.message);
        return false;
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        console.log('🔍 Finding user by ID:', id);

        let users;
        if (!FORCE_LOCAL_STORAGE) {
            try {
                const db = await getDb();
                users = db.collection<User>('users');
                return await users.findOne({ _id: safeObjectId(id) as any });
            } catch (e) {
                users = JsonDB.users;
            }
        } else {
            users = JsonDB.users;
        }

        const user = await (users as any).findOne({ _id: id });
        return user;
    } catch (error: any) {
        console.error('❌ Error finding user by ID:', error.message);
        return null;
    }
}

export async function updateUserSettings(userId: string, updates: Partial<{ name: string; settings: UserSettings }>): Promise<void> {
    try {
        console.log('🔄 Updating user settings:', userId);
        let users;

        if (!FORCE_LOCAL_STORAGE) {
            try {
                const db = await getDb();
                users = db.collection<User>('users');
                await users.updateOne(
                    { _id: safeObjectId(userId) as any },
                    { $set: updates }
                );
            } catch (e) {
                users = JsonDB.users;
                (JsonDB.users as any).updateOne({ _id: userId }, { $set: updates });
            }
        } else {
            (JsonDB.users as any).updateOne({ _id: userId }, { $set: updates });
        }
        console.log('✅ User settings updated');
    } catch (error: any) {
        console.error('❌ Error updating user settings:', error.message);
        throw error;
    }
}
