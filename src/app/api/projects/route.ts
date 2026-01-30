import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import {
    createProject,
    updateProject,
    getUserProjects,
    deleteProject,
} from '@/lib/db/models/Project';

// GET /api/projects - List user's projects
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const threadId = url.searchParams.get("threadId");

        if (threadId) {
            const { getProjectByThreadId } = await import('@/lib/db/models/Project');
            const project = await getProjectByThreadId(threadId);
            return NextResponse.json({ project });
        }

        const projects = await getUserProjects(session.user.id);
        return NextResponse.json({ projects });
    } catch (error: any) {
        console.error('❌ Error fetching projects:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch projects',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create or update project
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { threadId, prompt, requirements, plan, files, logs, qaFeedback, status, metadata, agentProgress, agents, globalProgress } = body;

        if (!threadId) {
            return NextResponse.json(
                { error: 'threadId is required' },
                { status: 400 }
            );
        }

        // Check if project exists
        const { getProjectByThreadId } = await import('@/lib/db/models/Project');
        const existingProject = await getProjectByThreadId(threadId);

        if (existingProject) {
            // Update existing project
            await updateProject(threadId, {
                requirements,
                plan,
                files,
                logs,
                qaFeedback,
                status,
                agents: agents || existingProject.agents,
                globalProgress: globalProgress !== undefined ? globalProgress : existingProject.globalProgress,
                metadata: metadata || existingProject.metadata,
                prompt: prompt || existingProject.prompt,
            });
            return NextResponse.json({ message: 'Project updated' });
        } else {
            // Create new project
            const project = await createProject(
                session.user.id,
                threadId,
                prompt || metadata?.title || 'Untitled Project',
                metadata
            );
            return NextResponse.json({ project }, { status: 201 });
        }
    } catch (error) {
        console.error('Error saving project:', error);
        return NextResponse.json(
            { error: 'Failed to save project' },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - handled in separate file
