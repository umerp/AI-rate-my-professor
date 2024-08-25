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
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);

  const [message, setMessage] = useState('')

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     const fetchedMessages = await fetchChatHistory();
  //     setMessages(fetchedMessages);
  //     setFetching(false);
  //   };
  //   fetchHistory();
  // }, []);

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ])
  
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
  
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {...lastMessage, content: lastMessage.content + text},
          ]
        })
        return reader.read().then(processText)
      })
    })
  }



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
          className="text-white py-2 font-semibold shadow-md bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg"
          variant="h5"
          align="center"
          gutterBottom
        >
          Need professor insights? Just ask!
        </Typography>
        <Box
          className="flex flex-col flex-grow overflow-y-auto mb-4 bg-gray-900 p-3 rounded-lg"
          style={{
            backgroundColor: "#1c1c1c", // Darker background inside chatbox
            borderRadius: "8px",
          }}
        >
          {fetching ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                mb={1}
              >
                <Box
                  px={3}
                  py={2}
                  borderRadius="16px"
                  style={{
                    backgroundColor:
                      message.role === "assistant" ? "#3f51b5" : "#673ab7",
                    color: "#ffffff",
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))
          )}
        </Box>
        <Box className='flex justify-center'>
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
