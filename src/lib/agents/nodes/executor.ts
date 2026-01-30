import { getModel } from "../model";
import { AgentState, PlanItem, ProjectFile } from "../state";
import { z } from "zod";
import { SystemMessage } from "@langchain/core/messages";

const CodeOutput = z.object({
    files: z.array(z.object({
        path: z.string(),
        content: z.string(),
        language: z.string()
    })),
    completion_status: z.enum(["success", "error"]),
    execution_log: z.string()
});

const EXECUTOR_PROMPT = `You are a Senior Software Engineer.
Your job is to implement the assigned task.
You will generate the code files needed.
Focus ONLY on the specific task assigned.
Do not overwrite files unless necessary for this task.
Return the full file content.`;

export const executorNode = async (state: typeof AgentState.State) => {
    // 1. Find the eligible task
    const plan = state.plan || [];
    const completedIds = new Set(plan.filter(p => p.status === "completed").map(p => p.id));

    const targetTask = plan.find(p =>
        p.status === "pending" &&
        p.assigned_to === "executor" &&
        p.dependencies.every(d => completedIds.has(d))
    );

    if (!targetTask) {
        return {
            logs: ["Executor: No pending actionable tasks found. All done or blocked?"],
        };
    }

    // 2. Mark as in_progress (conceptually, though we update state at end)

    const model = getModel(0);
    const structured = model.withStructuredOutput(CodeOutput);

    const context = `
    Current Task: ${targetTask.title}
    Description: ${targetTask.description}
    Requirements Context: ${state.requirements}
    Existing Files: ${state.files ? state.files.map(f => f.path).join(", ") : "None"}
  `;

    // To avoid HUGE context, we might not send all file contents, maybe just summaries or names.
    // For hackathon, we send what fits.

    const messages = [
        new SystemMessage(EXECUTOR_PROMPT),
        new SystemMessage(context)
    ];

    const response = await structured.invoke(messages);

    // 3. Update File System (State)
    const newFiles = state.files ? [...state.files] : [];

    for (const f of response.files) {
        const existingIdx = newFiles.findIndex(ef => ef.path === f.path);
        const newFileObj: ProjectFile = {
            path: f.path,
            content: f.content,
            language: f.language,
            status: "draft"
        };

        if (existingIdx !== -1) {
            newFiles[existingIdx] = newFileObj;
        } else {
            newFiles.push(newFileObj);
        }
    }

    // 4. Update Plan Status
    const newPlan = plan.map(p =>
        p.id === targetTask.id
            ? { ...p, status: response.completion_status === "success" ? "completed" : "failed" } as PlanItem
            : p
    );

    return {
        files: newFiles,
        plan: newPlan,
        current_agent: "executor",
        logs: [`Executor: Completed task '${targetTask.title}'. Generated ${response.files.length} files.`],
        // Manager will check plan next turn and dispatch 'executor' again if more tasks remain
    };
};
