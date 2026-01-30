import { getModel } from "../model";
import { AgentState, PlanItem } from "../state";
import { z } from "zod";
import { SystemMessage } from "@langchain/core/messages";

const PlanSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        dependencies: z.array(z.string()),
        assigned_to: z.enum(["executor", "qa", "reporting"]).default("executor")
    }))
});

const PLANNER_PROMPT = `You are a Technical Project Manager / Planner.
Review the Requirements Doc.
Break it down into a logical DAG (Directed Acyclic Graph) of tasks.
Ensure dependencies are correct.

Typical Tasks:
1. Setup Project Structure (if not exists)
2. Implement Core Libs
3. Implement Features
4. Implement UI
5. Final Review`;

export const plannerNode = async (state: typeof AgentState.State) => {
    const model = getModel(0);
    const structured = model.withStructuredOutput(PlanSchema);

    const context = `
    Requirements:
    ${state.requirements}
    
    Current Plan (if any):
    ${JSON.stringify(state.plan, null, 2)}
    
    QA Feedback (if any):
    ${JSON.stringify(state.qa_feedback, null, 2)}
  `;

    const messages = [
        new SystemMessage(PLANNER_PROMPT),
        new SystemMessage(context),
        ...state.messages.slice(-5)
    ];

    const response = await structured.invoke(messages);

    const newPlan: PlanItem[] = response.items.map(item => ({
        ...item,
        status: "pending", // Default
        assigned_to: item.assigned_to || "executor"
    }));

    return {
        plan: newPlan,
        current_agent: "planner",
        logs: [`Planner: Created ${newPlan.length} tasks.`],
        qa_feedback: null // Reset QA feedback as we have a new plan
    };
};
