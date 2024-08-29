import React from "react";
import { Box } from "@mui/material";
import Loader from "./Loader";

export default function MessageBubble({ message, loading }) {
  if (!message.content) {
    return null;
  }
  const formattedContent = message.content.replace(/\*\*/g, "");

  return (
    <Box
      display="flex"
      justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
      mb={2}
      alignItems="center"
      className="w-full"
    >
      <Box
        px={3}
        py={2}
        borderRadius="16px"
        className="whitespace-pre-wrap"
        style={{
          maxWidth: "70%",
          backgroundColor: message.role === "assistant" ? "#673ab7" : "#3f51b5",
          color: "#ffffff",
        }}
      >
        {loading ? <Loader /> : formattedContent}
      </Box>
    </Box>
  );
}
