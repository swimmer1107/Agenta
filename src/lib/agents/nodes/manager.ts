import { getModel } from "../model";
import { AgentState } from "../state";
import { z } from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const ManagerOutput = z.object({
    decision: z.enum(["requirement", "planner", "executor", "qa", "reporting", "finish"]),
    reasoning: z.string().describe("Explanation for why this agent was chosen"),
});

const MANAGER_PROMPT = `You are a Senior Project Manager for a software team.
Your goal is to orchestrate the development process by delegating to the right agent.

Agents:
- requirement: Gathers requirements. Call this first for new requests or if requirements are unclear.
- planner: Creates a task plan. Call this if requirements exist but no plan, or if plan needs update.
- executor: Implements the code. Call this to work on pending tasks in the plan.
- qa: Reviews the work. Call this after execution is done to verify quality.
- reporting: Summarizes the project. Call this at milestones or completion.
- finish: Only call this if the user's request is FULLY satisfied and reported.

Current State Analysis Rules:
1. If 'requirements' is null -> call 'requirement'.
2. If 'requirements' exists but 'plan' is null/empty -> call 'planner'.
3. If 'plan' has pending tasks -> call 'executor'.
4. If 'plan' is all completed but 'qa_feedback' is missing/outdated -> call 'qa'.
5. If 'qa_feedback' has failures -> call 'planner' (to re-plan fixes) or 'executor' (to fix directly).
6. If all done and verified -> call 'reporting' then 'finish'.

Output your decision and reasoning.`;

export const managerNode = async (state: typeof AgentState.State) => {
    const model = getModel(0);
    const structured = model.withStructuredOutput(ManagerOutput);

    // We only send the last few messages to avoid context overflow, plus system prompt
    const messages = [
        new SystemMessage(MANAGER_PROMPT),
        ...state.messages.slice(-10) // Keep context manageable
    ];

    // Explicitly add state context if not in messages
    const stateContext = `
    Current System State:
    - Requirements: ${state.requirements ? "Present" : "Missing"}
    - Plan: ${state.plan ? `${state.plan.length} items` : "Missing"}
    - Files: ${state.files ? state.files.length : 0}
    - QA Status: ${state.qa_feedback ? (state.qa_feedback.passed ? "Passed" : "Failed") : "Not Run"}
  `;

    messages.push(new SystemMessage(stateContext));

    const response = await structured.invoke(messages);

    return {
        next_agent: response.decision,
        current_agent: "manager",
        logs: [`Manager: ${response.reasoning}`],
    };
};
