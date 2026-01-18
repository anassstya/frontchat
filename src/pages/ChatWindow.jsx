import ChatBubble from "../components/ChatBubble.jsx";
import React, { useState, useEffect } from "react";
import "../App.scss";
import InputForm from "../components/InputForm.jsx";
import Header from "../components/Header.jsx";

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);


    useEffect(() => {
        const userID = localStorage.getItem("userID");
        if (!userID) {
            const initialMessages = [
                { type: "user", text: "hello!" },
                { type: "llm", text: "hello! how can I help you?" }
            ];
            setMessages(initialMessages);
            return;
        }

        fetch("/api/chat/history", {
            headers: {
                "X-User-ID": userID
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to load history");
                return res.json();
            })
            .then(history => {
                setMessages(history.map(msg => ({
                    type: msg.role === "user" ? "user" : "llm",  // БД → фронт
                    text: msg.content
                })));
            })
            .catch(err => {
                console.error("Load history error:", err);
                const initialMessages = [
                    { type: "user", text: "hello!" },
                    { type: "llm", text: "hello! how can I help you?" }
                ];
                setMessages(initialMessages);
            });
    }, []);


    return (
        <>
            <Header isGenerating={isGenerating}/>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} type={msg.type} text={msg.text} />
                ))}
            </div>
            <InputForm
                setMessages={setMessages}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
            />
        </>
    );
}