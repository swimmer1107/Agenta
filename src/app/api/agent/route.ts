import { mockAgentStream } from "@/lib/agents/mock";
import { agentGraph } from "@/lib/agents/graph";
import { HumanMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { message, threadId } = body;

    // Check if we should force mock (optional, for debugging)
    const forceMock = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                if (forceMock) throw new Error("ForceMock");

                const eventStream = await agentGraph.stream(
                    { messages: [new HumanMessage(message)] },
                    { configurable: { thread_id: threadId || Date.now().toString() } }
                );

                for await (const event of eventStream) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                }
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            } catch (e: any) {
                console.warn("Agent Error or Mock Fallback Triggered:", e);

                // Fallback to Mock if Quota exceeded or specific errors
                const errString = String(e);
                if (
                    errString.includes("InsufficientQuota") ||
                    errString.includes("429") ||
                    errString.includes("quota") ||
                    e.message === "ForceMock" ||
                    e.status === 429
                ) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        manager: { logs: ["System: API Quota Exceeded. Switching to Simulation Mode..."] }
                    })}\n\n`));

                    const mockGen = mockAgentStream(message);
                    for await (const event of mockGen) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                } else {
                    // Genuine other error
                    const errorJson = JSON.stringify({ error: String(e) });
                    controller.enqueue(encoder.encode(`data: ${errorJson}\n\n`));
                }
            } finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
