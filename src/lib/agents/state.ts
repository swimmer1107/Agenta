import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export type ProjectFile = {
  path: string;
  content: string;
  language: string;
  status: "draft" | "approved" | "rejected";
};

export type PlanItem = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  dependencies: string[];
  assigned_to: string; // "executor" usually
};

export type QAFeedback = {
  passed: boolean;
  issues: string[];
  recommendations: string[];
};

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  requirements: Annotation<string | null>({
    reducer: (x, y) => y ?? x,
  }),
  plan: Annotation<PlanItem[]>({
    reducer: (x, y) => y ?? x,
  }),
  files: Annotation<ProjectFile[]>({
    reducer: (x, y) => y ?? x,
  }),
  qa_feedback: Annotation<QAFeedback | null>({
    reducer: (x, y) => y ?? x,
  }),
  current_agent: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  next_agent: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  // For UI tracking
  logs: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  }),
});
