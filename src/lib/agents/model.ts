import { ChatOpenAI } from "@langchain/openai";

export const getModel = (temperature = 0) => {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY is not set. Agent execution will fail.");
    }
    return new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature,
    });
};
