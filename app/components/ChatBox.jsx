"use client";
import React, { useEffect, useState, useRef } from "react";
import { Container, Paper, Box } from "@mui/material";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import Loader from "./Loader";
import { fetchChatHistory, saveMessage } from "../services/chatService";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const bottomRef = useRef(null); 

  useEffect(() => {
    // Scroll to the bottom (latest message)
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      setFetching(true);
      const fetchedMessages = await fetchChatHistory();

      if (fetchedMessages.length > 0) {
        setMessages(fetchedMessages);
      } else {
        setMessages([
          {
            role: "assistant",
            content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
          },
        ]);
      }
      setFetching(false);
    };
    fetchHistory();
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      setMessage("");
      const updatedMessages = [
        ...messages,
        {role: "user", content: message },
      ]
      setMessages(updatedMessages)
      setLoading(true);

      try {
        let result = "";
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            ...messages,
            { role: "user", content: message },
          ]),
        }).then(async (res) => {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          const botMessage = { role: "assistant", content: ""}
          setLoading(false)
          setMessages((prevMessages) => [...prevMessages, botMessage])

          return reader.read().then(async function processText({ done, value }) {
              if (done) {
                const finalMessages = [...updatedMessages, botMessage];
                await saveMessage(finalMessages);
                return result;
              }
              const text = decoder.decode(value || new Uint8Array(), {
                stream: true,
              });
              result += text;

              setMessages((messages) => {
                let lastMessage = messages[messages.length - 1];
                let otherMessages = messages.slice(0, messages.length - 1);
                return [
                  ...otherMessages,
                  { ...lastMessage, content: lastMessage.content + text },
                ];
              });

              return reader.read().then(processText);
            });
        });
      } catch (error) {
        console.error("Failed to fetch response:", error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        style={{
          padding: "1rem",
          height: "75vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2e2e2e",
          color: "#e0e0e0",
        }}
      >
        <h2
          className="flex justify-center text-white text-2xl py-2 font-semibold shadow-md bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg"
    
          
          
        >
          Need professor insights? Just ask!
        </h2>
        <Box
          className="flex flex-col justify flex-grow overflow-y-auto mb-4 bg-gray-900 p-3 rounded-lg"
          style={{
            backgroundColor: "#1c1c1c",
            borderRadius: "8px",
          }}
        >
          {fetching ? (
            <div className="flex h-full  justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble
                  message={message}
                  loading={loading && index === messages.length - 1 && message.role === 'assistant'}
                  key={index}
                />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </Box>
        <Box className="flex justify-center">
          <MessageInput
            input={message}
            handleInputChange={(e) => setMessage(e.target.value)}
            handleSend={sendMessage}
            className="bg-gray-300 flex-grow"
            style={{
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid #444",
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
