import React from "react";
import "../App.scss";

export default function ChatBubble({type, text}){

    return(
        <div className={`chat-bubble ${type}`}>
            <p>{text}</p>
        </div>
    )
}