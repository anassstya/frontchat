import React, {useState} from "react";
import "../App.scss";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8051";

export default function InputForm({ setMessages, isGenerating, setIsGenerating }) {
    const [input, setInput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isGenerating) return;
        if (!input.trim()) return;

        const userMessage = input.trim();

        setMessages((prev) => [
            ...prev,
            { type: "user", text: userMessage },
            { type: "llm", text: "" },
        ]);

        setInput("");
        setIsGenerating(true);

        const userID = localStorage.getItem("userID");
        if (!userID) {
            setIsGenerating(false);
            console.error("No userID");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/chat/message?message=${encodeURIComponent(userMessage)}`,
                {
                    method: "GET",
                    headers: {
                        "X-User-ID": userID
                    }
                }
            );

            if (!response.ok) throw new Error("Chat API failed");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botReply = "";
            let isDone = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done || isDone) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();

                        if (data === '[DONE]') {
                            setIsGenerating(false);
                            isDone = true;
                            break;
                        }

                        if (data) {
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.delta) {
                                    botReply += parsed.delta;
                                    setMessages((prev) => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1] = {
                                            type: "llm",
                                            text: botReply
                                        };
                                        return newMessages;
                                    });
                                } else if (parsed.error) {
                                    console.error("Backend error:", parsed.error);
                                    setMessages((prev) => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1] = {
                                            type: "llm",
                                            text: `Error: ${parsed.error}`
                                        };
                                        return newMessages;
                                    });
                                    setIsGenerating(false);
                                    isDone = true;
                                    break;

                                }
                            } catch (err) {
                                console.error("Failed to parse SSE data:", data, err);
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Chat error:", err);
            setMessages((prev) => [
                ...prev,
                { type: "llm", text: "Error: Failed to get response" }
            ]);
            setIsGenerating(false);
        }
    };



    return (
        <form className="input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="input-form__msg"
                placeholder="Type your message…"
                value={input}
                disabled={isGenerating}
                onChange={e => setInput(e.target.value)}
            />
            <button
                className="input-form__btn"
                type="submit"
                disabled={isGenerating || !input?.trim()}
            >
                {isGenerating ? "Generating..." : "Send"}
            </button>
        </form>
    );
}
