import fs from 'fs';
import path from 'path';

// Simple JSON file storage system
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure files exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
}

export class JsonDB {
    private static read(file: string): any[] {
        try {
            const data = fs.readFileSync(file, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${file}:`, error);
            return [];
        }
    }

    private static write(file: string, data: any[]) {
        try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing ${file}:`, error);
        }
    }

    static get users() {
        return {
            find: (query: any) => {
                const users = JsonDB.read(USERS_FILE);
                // Simple query matching
                return users.filter(user => {
                    return Object.keys(query).every(key => user[key] === query[key]);
                });
            },
            findOne: (query: any) => {
                const users = JsonDB.read(USERS_FILE);
                return users.find(user => {
                    return Object.keys(query).every(key => {
                        // Handle strict equality
                        return user[key] === query[key];
                    });
                }) || null;
            },
            insertOne: (doc: any) => {
                const users = JsonDB.read(USERS_FILE);
                const newUser = { ...doc, _id: doc._id || Math.random().toString(36).substring(7) };
                users.push(newUser);
                JsonDB.write(USERS_FILE, users);
                return { insertedId: newUser._id };
            }
        };
    }

    static get projects() {
        return {
            find: (query: any) => {
                const projects = JsonDB.read(PROJECTS_FILE);
                // Handle complex queries roughly or just exact match
                if (Object.keys(query).length === 0) return projects;

                return projects.filter(project => {
                    // Very basic implementation for common queries
                    return Object.keys(query).every(key => {
                        if (key === 'userId') return project.userId === query.userId;
                        if (key === 'threadId') return project.threadId === query.threadId;
                        return project[key] === query[key];
                    });
                });
            },
            findOne: (query: any) => {
                const projects = JsonDB.read(PROJECTS_FILE);
                return projects.find(project => {
                    return Object.keys(query).every(key => {
                        if (key === 'userId') return project.userId === query.userId;
                        if (key === 'threadId') return project.threadId === query.threadId;
                        return project[key] === query[key];
                    });
                }) || null;
            },
            insertOne: (doc: any) => {
                const projects = JsonDB.read(PROJECTS_FILE);
                const newProject = { ...doc, _id: doc._id || Math.random().toString(36).substring(7) };
                projects.push(newProject);
                JsonDB.write(PROJECTS_FILE, projects);
                return { insertedId: newProject._id };
            },
            updateOne: (query: any, update: any) => {
                const projects = JsonDB.read(PROJECTS_FILE);
                const index = projects.findIndex(project => {
                    return Object.keys(query).every(key => project[key] === query[key]);
                });

                if (index !== -1) {
                    // Handle $set operator
                    const updates = update.$set || update;
                    projects[index] = { ...projects[index], ...updates };
                    JsonDB.write(PROJECTS_FILE, projects);
                    return { modifiedCount: 1 };
                }
                return { modifiedCount: 0 };
            },
            deleteOne: (query: any) => {
                let projects = JsonDB.read(PROJECTS_FILE);
                const initialLength = projects.length;
                projects = projects.filter(project => {
                    return !Object.keys(query).every(key => project[key] === query[key]);
                });

                if (projects.length !== initialLength) {
                    JsonDB.write(PROJECTS_FILE, projects);
                }
            }
        };
    }
}
