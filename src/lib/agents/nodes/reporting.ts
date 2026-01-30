import { getModel } from "../model";
import { AgentState } from "../state";
import { z } from "zod";
import { SystemMessage } from "@langchain/core/messages";

const ReportOutput = z.object({
    summary_markdown: z.string(),
});

const REPORTING_PROMPT = `You are the Delivery Manager.
Generate a final project report.
Include:
- Project Summary
- Features Implemented
- QA Results
- Tech Stack Used
- Next Steps / Recommendations for the User`;

export const reportingNode = async (state: typeof AgentState.State) => {
    const model = getModel(0);
    const structured = model.withStructuredOutput(ReportOutput);

    const context = `
    Reqs: ${state.requirements}
    Plan Items: ${state.plan?.length}
    Files: ${state.files?.length}
    QA: ${JSON.stringify(state.qa_feedback)}
  `;

    const messages = [
        new SystemMessage(REPORTING_PROMPT),
        new SystemMessage(context)
    ];

    const response = await structured.invoke(messages);

    return {
        current_agent: "reporting",
        logs: ["Reporting: Final report generated."],
        messages: [new SystemMessage(response.summary_markdown)] // Append report to messages for easy access
    };
};
