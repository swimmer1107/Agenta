
export async function* mockAgentStream(prompt: string) {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    // 1. Manager Analysis
    yield { manager: { next_agent: "requirement", logs: ["Manager: Analyzing request...", "Manager: Delegating to Business Analyst."] } };
    await sleep(800);

    // 2. Requirements
    yield {
        requirement: {
            current_agent: "requirement",
            requirements: `## Requirements for: ${prompt}\n\n1. Core Logic\n2. User Interface\n3. Integration Tests\n\nAssumptions: Standard stack.`,
            logs: ["Business Analyst: Drafting requirements...", "Business Analyst: Requirements finalized."]
        }
    };
    await sleep(1000);

    // 3. Manager -> Planner
    yield { manager: { next_agent: "planner", logs: ["Manager: Requirements received. Calling Planner."] } };
    await sleep(600);

    // 4. Planner
    yield {
        planner: {
            current_agent: "planner",
            plan: [
                { id: "1", title: "Setup Project", description: "Initialize repo", status: "pending", assigned_to: "executor", dependencies: [] },
                { id: "2", title: "Implement Core Features", description: "Business logic implementation", status: "pending", assigned_to: "executor", dependencies: ["1"] },
                { id: "3", title: "Frontend UI", description: "React components", status: "pending", assigned_to: "executor", dependencies: ["2"] },
            ],
            logs: ["Planner: Creating execution plan...", "Planner: Plan approved."]
        }
    };
    await sleep(1000);

    // 5. Execution Loop (Simulate 2 tasks)
    yield { manager: { next_agent: "executor", logs: ["Manager: Executing Task 1: Setup Project"] } };
    await sleep(800);

    yield {
        executor: {
            current_agent: "executor",
            logs: ["Executor: Writing 'package.json'...", "Executor: Environment setup complete."],
            files: [{ path: "package.json", content: "{\n  \"name\": \"ai-app\",\n  \"version\": \"1.0.0\"\n}", language: "json", status: "draft" }],
            plan: [
                { id: "1", title: "Setup Project", description: "Initialize repo", status: "completed", assigned_to: "executor", dependencies: [] },
                { id: "2", title: "Implement Core Features", description: "Business logic implementation", status: "pending", assigned_to: "executor", dependencies: ["1"] },
                { id: "3", title: "Frontend UI", description: "React components", status: "pending", assigned_to: "executor", dependencies: ["2"] },
            ]
        }
    };
    await sleep(1200);

    yield { manager: { next_agent: "executor", logs: ["Manager: Executing Task 2: Implement Core Features"] } };
    await sleep(800);

    yield {
        executor: {
            current_agent: "executor",
            logs: ["Executor: Writing 'core.ts'...", "Executor: Logic implemented."],
            files: [
                { path: "package.json", content: "{\n  \"name\": \"ai-app\",\n  \"version\": \"1.0.0\"\n}", language: "json", status: "draft" },
                { path: "src/core.ts", content: "export const logic = () => {\n  console.log('AI Magic');\n}", language: "typescript", status: "draft" }
            ],
            plan: [
                { id: "1", title: "Setup Project", description: "Initialize repo", status: "completed", assigned_to: "executor", dependencies: [] },
                { id: "2", title: "Implement Core Features", description: "Business logic implementation", status: "completed", assigned_to: "executor", dependencies: ["1"] },
                { id: "3", title: "Frontend UI", description: "React components", status: "pending", assigned_to: "executor", dependencies: ["2"] },
            ]
        }
    };
    await sleep(1200);

    // Task 3
    yield { manager: { next_agent: "executor", logs: ["Manager: Executing Task 3: Frontend UI"] } };
    await sleep(800);

    yield {
        executor: {
            current_agent: "executor",
            logs: ["Executor: Building UI components...", "Executor: Frontend complete."],
            files: [
                { path: "package.json", content: "{\n  \"name\": \"ai-app\",\n  \"version\": \"1.0.0\"\n}", language: "json", status: "draft" },
                { path: "src/core.ts", content: "export const logic = () => {\n  console.log('AI Magic');\n}", language: "typescript", status: "draft" },
                { path: "src/App.tsx", content: "export default function App() {\n  return <h1>Hello AI</h1>;\n}", language: "typescript", status: "draft" }
            ],
            plan: [
                { id: "1", title: "Setup Project", description: "Initialize repo", status: "completed", assigned_to: "executor", dependencies: [] },
                { id: "2", title: "Implement Core Features", description: "Business logic implementation", status: "completed", assigned_to: "executor", dependencies: ["1"] },
                { id: "3", title: "Frontend UI", description: "React components", status: "completed", assigned_to: "executor", dependencies: ["2"] },
            ]
        }
    };
    await sleep(1200);

    // 6. QA
    yield { manager: { next_agent: "qa", logs: ["Manager: Tasks complete. Requesting QA."] } };
    await sleep(800);

    yield {
        qa: {
            current_agent: "qa",
            logs: ["QA: Running test suite...", "QA: All tests passed."],
            qa_feedback: { passed: true, issues: [], recommendations: ["Ready for deploy"] }
        }
    };
    await sleep(1000);

    // 7. Finish
    yield { manager: { next_agent: "finish", logs: ["Manager: Project successfully completed."] } };
}
