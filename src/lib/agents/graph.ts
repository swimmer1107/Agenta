import { StateGraph, END, START } from "@langchain/langgraph";
import { AgentState } from "./state";
import { managerNode } from "./nodes/manager";
import { requirementNode } from "./nodes/requirement";
import { plannerNode } from "./nodes/planner";
import { executorNode } from "./nodes/executor";
import { qaNode } from "./nodes/qa";
import { reportingNode } from "./nodes/reporting";

const graph = new StateGraph(AgentState)
    .addNode("manager", managerNode)
    .addNode("requirement", requirementNode)
    .addNode("planner", plannerNode)
    .addNode("executor", executorNode)
    .addNode("qa", qaNode)
    .addNode("reporting", reportingNode)

    .addEdge(START, "manager")

    .addConditionalEdges(
        "manager",
        (state) => state.next_agent,
        {
            requirement: "requirement",
            planner: "planner",
            executor: "executor",
            qa: "qa",
            reporting: "reporting",
            finish: END
        }
    )

    .addEdge("requirement", "manager")
    .addEdge("planner", "manager")
    .addEdge("executor", "manager")
    .addEdge("qa", "manager")
    .addEdge("reporting", "manager");

import { MemorySaver } from "@langchain/langgraph";
const checkpointer = new MemorySaver();

export const agentGraph = graph.compile({ checkpointer });
