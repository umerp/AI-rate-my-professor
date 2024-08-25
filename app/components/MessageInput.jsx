import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function MessageInput({ input, handleInputChange, handleSend }) {
  return (
    <Box className='flex w-full'>
      <TextField
        variant="outlined"
        fullWidth
        sx={{ input: { color: "white"}}}
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message here..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
