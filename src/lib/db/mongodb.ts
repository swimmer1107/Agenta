import { MongoClient, Db, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MONGODB_URI = process.env.MONGODB_URI;
const USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true';

let memoryServer: MongoMemoryServer | null = null;

const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000, // Reduced to 5s for faster fallback
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
    var _memoryServer: MongoMemoryServer | undefined;
}

async function createMemoryServer(): Promise<string> {
    if (global._memoryServer) {
        return global._memoryServer.getUri();
    }

    console.log('🔄 Starting in-memory MongoDB server...');
    const server = await MongoMemoryServer.create();
    global._memoryServer = server;
    const uri = server.getUri();
    console.log('✅ In-memory MongoDB server started');
    return uri;
}

async function connectToMongoDB(): Promise<MongoClient> {
    // If USE_MEMORY_DB is explicitly set, use memory database
    if (USE_MEMORY_DB) {
        console.log('📝 Using in-memory MongoDB (USE_MEMORY_DB=true)');
        const uri = await createMemoryServer();
        const client = new MongoClient(uri);
        await client.connect();
        console.log('✅ Connected to in-memory MongoDB');
        return client;
    }

    // Try MongoDB Atlas first
    if (MONGODB_URI) {
        try {
            console.log('🔄 Attempting to connect to MongoDB Atlas...');
            const client = new MongoClient(MONGODB_URI, options);
            await client.connect();

            // Test the connection
            await client.db('admin').command({ ping: 1 });
            console.log('✅ MongoDB Atlas connected successfully');
            return client;
        } catch (error: any) {
            console.error('❌ MongoDB Atlas connection failed:', error.message);
            console.log('⚠️ Falling back to in-memory database...');
        }
    }

    // Fallback to in-memory database
    console.log('📝 Using in-memory MongoDB as fallback');
    const uri = await createMemoryServer();
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to in-memory MongoDB');
    console.log('⚠️ WARNING: Data will not persist! Fix MongoDB Atlas for production.');
    return client;
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection
    if (!global._mongoClientPromise) {
        clientPromise = connectToMongoDB();
        global._mongoClientPromise = clientPromise;
    } else {
        clientPromise = global._mongoClientPromise;
    }
} else {
    // In production mode, create a new client
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is required in production');
    }
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
    try {
        const client = await clientPromise;
        const db = client.db('ai-project-manager');

        // Test the connection
        await db.command({ ping: 1 });

        return db;
    } catch (error: any) {
        console.error('❌ Failed to get database:', error.message);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

/**
 * Safely converts a string to a MongoDB ObjectId if it's a valid hex string.
 * Otherwise returns the original string.
 */
export function safeObjectId(id: string | ObjectId): ObjectId | string {
    if (!id) return id;
    if (typeof id !== 'string') return id;

    // Check if it's a valid 24-character hex string
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
        try {
            return new ObjectId(id);
        } catch (e) {
            return id;
        }
    }
    return id;
}

export async function testConnection(): Promise<boolean> {
    try {
        const db = await getDb();
        await db.command({ ping: 1 });
        console.log('✅ Database connection test successful');
        return true;
    } catch (error: any) {
        console.error('❌ Database connection test failed:', error.message);
        return false;
    }
}

export default clientPromise;
