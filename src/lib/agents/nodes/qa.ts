import { getModel } from "../model";
import { AgentState, QAFeedback } from "../state";
import { z } from "zod";
import { SystemMessage } from "@langchain/core/messages";

const QAOutput = z.object({
    passed: z.boolean(),
    issues: z.array(z.string()),
    recommendations: z.array(z.string())
});

const QA_PROMPT = `You are the Lead QA Engineer.
Review the code files generated against the Requirements.
Look for:
- Missing features
- Logical errors
- Safety violations
- Code quality issues

If CRITICAL issues exist, fail the check.
If minor issues or perfect, pass the check.`;

export const qaNode = async (state: typeof AgentState.State) => {
    const model = getModel(0);
    const structured = model.withStructuredOutput(QAOutput);

    // Serialize files for review
    const filesContent = state.files?.map(f => `File: ${f.path}\n${f.content}`).join("\n\n") || "No files.";

    const context = `
    Requirements:
    ${state.requirements}
    
    Generated Code:
    ${filesContent}
  `;

    const messages = [
        new SystemMessage(QA_PROMPT),
        new SystemMessage(context)
    ];

    const response = await structured.invoke(messages);

    const feedback: QAFeedback = {
        passed: response.passed,
        issues: response.issues,
        recommendations: response.recommendations
    };

    return {
        qa_feedback: feedback,
        current_agent: "qa",
        logs: [`QA: Review complete. Passed: ${response.passed}. Issues: ${response.issues.length}`],
    };
};
