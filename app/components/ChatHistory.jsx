import React from "react";
import { List, ListItem, Box } from "@mui/material";
import MessageBubble from "./MessageBubble";

export default function ChatHistory({ messages, loading }) {
  return (
    <List>
      {messages.length > 1 ? (
        messages.map((message, index) => (
          <ListItem key={index}>
            <MessageBubble message={message} />
          </ListItem>
        ))
      ) : (
        <div className="relative grid place-items-center h-full text-gray-400">
          Start a new conversation with ProfsRated AI
        </div>
      )}
      {loading && (
        <Box className="ml-20">
          <Image
            src="/loader.svg"
            alt="Loading..."
            width={40}
            height={40}
          />
        </Box>
      )}
    </List>
  );
}
