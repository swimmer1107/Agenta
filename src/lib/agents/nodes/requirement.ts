import { getModel } from "../model";
import { AgentState } from "../state";
import { z } from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const RequirementOutput = z.object({
    requirements_doc: z.string().describe("The detailed requirements document in markdown"),
    assumptions: z.array(z.string()).describe("List of assumptions made"),
});

const REQUIREMENT_PROMPT = `You are a Senior Business Analyst.
Analyze the user's request and conversation history.
Create a detailed Requirements Document.

Format:
- Functional Requirements
- Non-Functional Requirements (Perf, Security)
- Constraints
- Tech Stack (if specified or implied)

Make reasonable assumptions to fill gaps. Do not ask back for clarification unless completely blocked. Document your assumptions.`;

export const requirementNode = async (state: typeof AgentState.State) => {
    const model = getModel(0);
    const structured = model.withStructuredOutput(RequirementOutput);

    const messages = [
        new SystemMessage(REQUIREMENT_PROMPT),
        ...state.messages
    ];

    const response = await structured.invoke(messages);

    return {
        requirements: response.requirements_doc,
        current_agent: "requirement",
        logs: [
            `Requirement Analyst: Requirements generated.`,
            ...response.assumptions.map(a => `Assumption: ${a}`)
        ],
        // Reset plan if requirements change
        plan: null,
        // Return to manager to decide next step (which should depend on these new reqs)
    };
};
