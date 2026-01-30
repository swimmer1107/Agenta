
const url = "http://localhost:3000/api/agent";
const payload = {
    message: "Test Task",
    threadId: "debug-node-123"
};

console.log(`Connecting to ${url}...`);

(async () => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`HTTP Error: ${response.status}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        console.log("Connected. Streaming...");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            console.log("RAW CHUNK START");
            console.log(chunk);
            console.log("RAW CHUNK END");
        }
    } catch (e) {
        console.error("Error:", e);
    }
})();
