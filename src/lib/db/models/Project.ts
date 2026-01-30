import { getDb, safeObjectId } from '../mongodb';
import { ObjectId } from 'mongodb';
import { PlanItem, ProjectFile, QAFeedback } from '../../agents/state';

export interface Project {
    _id?: ObjectId;
    userId: ObjectId | string;
    threadId: string;
    prompt: string;
    requirements: string | null;
    plan: PlanItem[] | null;
    files: ProjectFile[] | null;
    logs: string[];
    qaFeedback: QAFeedback | null;
    status: 'running' | 'completed' | 'failed';
    globalProgress: number;
    agents: {
        name: string;
        role: string;
        progress: number;
        status: 'idle' | 'running' | 'completed' | 'failed';
    }[];
    report?: {
        markdown: string;
        pdfUrl?: string;
        generatedAt: Date;
    };
    metadata?: {
        title: string;
        description: string;
        options: {
            isCode?: boolean;
            isFast?: boolean;
            isDetailed?: boolean;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

export async function createProject(
    userId: string,
    threadId: string,
    prompt: string,
    metadata?: Project['metadata']
): Promise<Project> {
    const db = await getDb();
    const projects = db.collection<Project>('projects');

    const project: Project = {
        userId: safeObjectId(userId),
        threadId,
        prompt,
        metadata,
        requirements: null,
        plan: null,
        files: null,
        logs: [],
        globalProgress: 0,
        agents: [
            { name: "Manager", role: "Project Lead", progress: 0, status: "idle" },
            { name: "Alice", role: "Requirements Agent", progress: 0, status: "idle" },
            { name: "Bob", role: "Planning Agent", progress: 0, status: "idle" },
            { name: "Charlie", role: "Coding Agent", progress: 0, status: "idle" },
            { name: "Diana", role: "QA Agent", progress: 0, status: "idle" },
            { name: "Reporting", role: "Documentation", progress: 0, status: "idle" }
        ],
        qaFeedback: null,
        status: 'running',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await projects.insertOne(project);
    return { ...project, _id: result.insertedId };
}

export async function updateProject(
    threadId: string,
    updates: Partial<Omit<Project, '_id' | 'userId' | 'threadId' | 'createdAt'>>
): Promise<void> {
    const db = await getDb();
    const projects = db.collection<Project>('projects');

    await projects.updateOne(
        { threadId },
        {
            $set: {
                ...updates,
                updatedAt: new Date(),
            },
        }
    );
}

export async function getProjectByThreadId(threadId: string): Promise<Project | null> {
    const db = await getDb();
    const projects = db.collection<Project>('projects');
    return projects.findOne({ threadId });
}

export async function getUserProjects(userId: string): Promise<Project[]> {
    const db = await getDb();
    const projects = db.collection<Project>('projects');
    return projects
        .find({ userId: safeObjectId(userId) })
        .sort({ updatedAt: -1 })
        .toArray();
}

export async function deleteProject(projectId: string): Promise<void> {
    const db = await getDb();
    const projects = db.collection<Project>('projects');
    await projects.deleteOne({ _id: safeObjectId(projectId) as ObjectId });
}
