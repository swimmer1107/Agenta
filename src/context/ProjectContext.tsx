"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type AgentStatus = "idle" | "running" | "completed" | "failed";

interface ProjectPlan {
    title: string;
    description: string;
    status: "pending" | "running" | "completed" | "failed";
}

interface ProjectState {
    threadId: string;
    requirements: string | null;
    plan: ProjectPlan[] | null;
    files: any[] | null;
    logs: string[];
    agentStatuses: Record<string, AgentStatus>;
    agentProgress: Record<string, number>;
    currentAgent: string | null;
    isProcessing: boolean;
    isCompleted: boolean;
    metadata: {
        title: string;
        description: string;
        options: {
            isCode?: boolean;
            isFast?: boolean;
            isDetailed?: boolean;
        };
    } | null;
}

interface ProjectContextType extends ProjectState {
    startTask: (metadata: NonNullable<ProjectState["metadata"]>) => Promise<void>;
    resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ProjectState>({
        threadId: "",
        requirements: null,
        plan: null,
        files: null,
        logs: [],
        agentStatuses: {
            manager: "idle",
            requirement: "idle",
            planner: "idle",
            executor: "idle",
            qa: "idle",
            reporting: "idle",
        } as Record<string, AgentStatus>,
        agentProgress: {
            manager: 0,
            requirement: 0,
            planner: 0,
            executor: 0,
            qa: 0,
            reporting: 0
        },
        currentAgent: null,
        isProcessing: false,
        isCompleted: false,
        metadata: null
    });

    // Load from URL (threadId rehydration) or localStorage on mount
    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const urlThreadId = searchParams.get("threadId");

        const loadProject = async (id: string) => {
            try {
                const res = await fetch(`/api/projects?threadId=${id}`);
                const data = await res.json();
                if (data.project) {
                    const p = data.project;

                    // Map agents array back to objects for the context
                    const newStatuses: Record<string, AgentStatus> = {};
                    const newProgress: Record<string, number> = {};

                    const reverseMapping: Record<string, string> = {
                        "Manager": "manager",
                        "Alice": "requirement",
                        "Bob": "planner",
                        "Charlie": "executor",
                        "Diana": "qa",
                        "Reporting": "reporting"
                    };

                    p.agents?.forEach((a: any) => {
                        const key = reverseMapping[a.name];
                        if (key) {
                            newStatuses[key] = a.status;
                            newProgress[key] = a.progress;
                        }
                    });

                    setState({
                        threadId: p.threadId,
                        requirements: p.requirements,
                        plan: p.plan,
                        files: p.files,
                        logs: p.logs || [],
                        agentStatuses: Object.keys(newStatuses).length ? newStatuses : state.agentStatuses,
                        agentProgress: Object.keys(newProgress).length ? newProgress : state.agentProgress,
                        currentAgent: null,
                        isProcessing: p.status === 'running',
                        isCompleted: p.status === 'completed',
                        metadata: p.metadata
                    });
                }
            } catch (error) {
                console.error("Rehydration failed", error);
            }
        };

        if (urlThreadId) {
            loadProject(urlThreadId);
        } else {
            const saved = localStorage.getItem("orchestrai_project_state");
            if (saved) {
                try {
                    setState(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to load saved state", e);
                }
            }
        }
    }, []);

    // Persistence Effect
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("orchestrai_project_state", JSON.stringify(state));
        }
    }, [state]);

    const resetProject = React.useCallback(() => {
        const newState: ProjectState = {
            threadId: Date.now().toString(),
            requirements: null,
            plan: null,
            files: null,
            logs: [],
            agentStatuses: {
                manager: "idle",
                requirement: "idle",
                planner: "idle",
                executor: "idle",
                qa: "idle",
                reporting: "idle"
            },
            agentProgress: {
                manager: 0,
                requirement: 0,
                planner: 0,
                executor: 0,
                qa: 0,
                reporting: 0
            },
            currentAgent: null,
            isProcessing: false,
            isCompleted: false,
            metadata: null
        };
        setState(newState);
        localStorage.removeItem("nexus_project_state");
    }, []);

    const startTask = React.useCallback(async (metadata: NonNullable<ProjectState["metadata"]>) => {
        const newThreadId = Date.now().toString();
        const prompt = `Project Title: ${metadata.title}\nDescription: ${metadata.description}\nMode: ${metadata.options.isDetailed ? 'Detailed Analysis' : 'Fast Path'}`;

        setState(prev => ({
            ...prev,
            isProcessing: true,
            isCompleted: false,
            threadId: newThreadId,
            metadata,
            logs: [`System: Initializing "${metadata.title}" evaluation...`]
        }));

        try {
            // 1. Immediate Save to DB
            await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId: newThreadId,
                    prompt: metadata.title,
                    metadata,
                    status: 'running',
                    globalProgress: 0,
                    agents: [
                        { name: "Manager", role: "Project Lead", progress: 0, status: "idle" },
                        { name: "Alice", role: "Requirements Agent", progress: 0, status: "idle" },
                        { name: "Bob", role: "Planning Agent", progress: 0, status: "idle" },
                        { name: "Charlie", role: "Coding Agent", progress: 0, status: "idle" },
                        { name: "Diana", role: "QA Agent", progress: 0, status: "idle" },
                        { name: "Reporting", role: "Documentation", progress: 0, status: "idle" }
                    ]
                })
            });

            const response = await fetch("/api/agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt, threadId: newThreadId }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                while (true) {
                    const paramsIndex = buffer.indexOf("\n\n");
                    if (paramsIndex === -1) break;

                    const message = buffer.slice(0, paramsIndex);
                    buffer = buffer.slice(paramsIndex + 2);

                    if (message.startsWith("data: ")) {
                        const dataStr = message.slice(6).trim();
                        if (dataStr === "[DONE]") {
                            setState(prev => {
                                const finalState = { ...prev, isProcessing: false, isCompleted: true };
                                // 2. Final Sync to DB
                                fetch("/api/projects", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        threadId: finalState.threadId,
                                        requirements: finalState.requirements,
                                        plan: finalState.plan,
                                        files: finalState.files,
                                        logs: finalState.logs,
                                        agentProgress: finalState.agentProgress,
                                        status: 'completed'
                                    })
                                }).catch(console.error);
                                return finalState;
                            });
                            continue;
                        }

                        try {
                            const update = JSON.parse(dataStr);
                            handleStateUpdate(update);
                        } catch (e) {
                            console.error("Parse error", e, "Data:", dataStr);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error starting task:", error);
            setState(prev => ({ ...prev, isProcessing: false, logs: [...prev.logs, "Error: Failed to start task."] }));
        }
    }, []);

    const handleStateUpdate = React.useCallback((update: any) => {
        if (update.error) {
            setState(prev => ({
                ...prev,
                isProcessing: false,
                logs: [...prev.logs, `Error: ${update.error}`]
            }));
            return;
        }

        const agentName = Object.keys(update)[0];
        const data = update[agentName];

        if (!data) return;

        setState(prev => {
            const newStatuses = { ...prev.agentStatuses };
            const newProgress = { ...prev.agentProgress };

            // Set the active agent to running
            newStatuses[agentName] = "running";

            // If data contains explicit progress, use it
            if (data.progress !== undefined) {
                newProgress[agentName] = data.progress;
            } else if (newStatuses[agentName] === "running" && (newProgress[agentName] || 0) < 90) {
                // Slower progressive grow only if not near completion
                newProgress[agentName] = Math.min((newProgress[agentName] || 0) + 5, 90);
            }

            const newLogs = [...prev.logs];
            if (data.logs) {
                newLogs.push(...data.logs);
            }

            // Check for transitions or completion
            let isCompleted = prev.isCompleted;
            if (data.next_agent || data.status === "completed") {
                // Current agent finished its work
                newStatuses[agentName] = "completed";
                newProgress[agentName] = 100; // Mandatory snap to 100%

                if (data.next_agent === "finish" || agentName === "reporting") {
                    isCompleted = true;
                    // Force all agents to 100% on completion
                    Object.keys(newProgress).forEach(key => {
                        newProgress[key] = 100;
                        if (newStatuses[key] === "idle" || newStatuses[key] === "running") {
                            newStatuses[key] = "completed";
                        }
                    });
                }
            } else if (data.status === "failed") {
                newStatuses[agentName] = "failed";
                newProgress[agentName] = 100; // Terminal state snaps to 100%
            } else if (data.status === "skipped") {
                newStatuses[agentName] = "completed"; // skipped counts as done for progress
                newProgress[agentName] = 100;
            }

            const newState = {
                ...prev,
                requirements: data.requirements !== undefined ? data.requirements : prev.requirements,
                plan: data.plan !== undefined ? data.plan : prev.plan,
                files: data.files !== undefined ? data.files : prev.files,
                currentAgent: agentName,
                agentStatuses: newStatuses,
                agentProgress: newProgress,
                logs: newLogs,
                isCompleted
            };

            // SYNC TO MONGODB
            const agentMapping: Record<string, { name: string, role: string }> = {
                manager: { name: "Manager", role: "Project Lead" },
                requirement: { name: "Alice", role: "Requirements Agent" },
                planner: { name: "Bob", role: "Planning Agent" },
                executor: { name: "Charlie", role: "Coding Agent" },
                qa: { name: "Diana", role: "QA Agent" },
                reporting: { name: "Reporting", role: "Documentation" }
            };

            const agentsArray = Object.keys(agentMapping).map(key => ({
                name: agentMapping[key].name,
                role: agentMapping[key].role,
                progress: newProgress[key] || 0,
                status: newStatuses[key] || "idle"
            }));

            const completedCount = agentsArray.filter(a => a.status === "completed" || a.status === "failed").length;
            const globalProgress = isCompleted ? 100 : Math.round((completedCount / agentsArray.length) * 100);

            // Async sync to avoid blocking UI
            fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    threadId: prev.threadId,
                    requirements: newState.requirements,
                    plan: newState.plan,
                    files: newState.files,
                    logs: newState.logs,
                    agentProgress: newProgress, // For legacy support if needed
                    agents: agentsArray,
                    globalProgress,
                    status: isCompleted ? 'completed' : 'running'
                })
            }).catch(console.error);

            return newState;
        });
    }, []);

    const value = React.useMemo(() => ({
        ...state,
        startTask,
        resetProject
    }), [state, startTask, resetProject]);

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error("useProject must be used within ProjectProvider");
    return context;
};
