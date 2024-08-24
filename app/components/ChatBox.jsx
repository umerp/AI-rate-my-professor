"use client";
import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
import { Container, Paper, Typography, Box } from "@mui/material";
import { raleway } from "../fonts";
import ChatHistory from "./ChatHistory";
import MessageInput from "./MessageInput";
import Loader from "./Loader";
import {
  fetchChatHistory,
  saveMessage,
  fetchBotResponse,
} from "../services/chatService";

export default function Chatbox() {
  //   const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const fetchedMessages = await fetchChatHistory();
      setMessages(fetchedMessages);
      setFetching(false);
    };
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, type: "user", timestamp: Date.now() };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setInput("");

      await saveMessage(newMessage);
      setLoading(true);

      const botResponse = await fetchBotResponse(input);
      const botMessage = {
        text: botResponse,
        type: "bot",
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      setLoading(false);

      await saveMessage(botMessage);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
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
          backgroundColor: "#2e2e2e", // Dark background for chatbox
          color: "#e0e0e0", // Light text color for readability
        }}
      >
        <Typography
          className={` text-white py-2 font-semibold shadow-md bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg`}
          variant="h5"
          align="center"
          gutterBottom
        >
          Need professor insights? Just ask!
        </Typography>
        <Box
        className='flex justify-center items-center'
          style={{
            flexGrow: 1,
            overflowY: "auto",
            marginBottom: "1rem",
            backgroundColor: "#1c1c1c", // Darker background inside chatbox
            borderRadius: "8px",
            
          }}
        >
          {fetching ? (
            <Loader />
          ) : (
            <ChatHistory messages={messages} loading={loading} />
          )}
        </Box>
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSend={handleSend}
          className='bg-gray-300'
          style={{
            
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid #444", // Slight border to distinguish input
          }}
        />
      </Paper>
    </Container>
  );
}
