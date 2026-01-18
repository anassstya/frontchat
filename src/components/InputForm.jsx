import React, {useState} from "react";
import "../App.scss";

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
            const response = await fetch("/api/chat/message", {
                method: "POST",
                headers: {
                    "X-User-ID": userID,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error("Chat API failed");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botReply = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            reader.cancel();
                            setIsGenerating(false);
                            break;
                        }
                        if (data) {
                            botReply += data;
                            setMessages((prev) => {
                                const newMessages = [...prev];
                                newMessages[newMessages.length - 1] = {
                                    type: "llm",
                                    text: botReply
                                };
                                return newMessages;
                            });
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Chat error:", err);
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
