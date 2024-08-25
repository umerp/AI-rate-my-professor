import React from "react";
import { Paper, Grid, ListItemText } from "@mui/material";

export default function MessageBubble({ message }) {
  return (
    <Grid
      container
      spacing={2}
      justifyContent={message.type === "user" ? "flex-end" : "flex-start"}
    >
      <Grid item xs={12} sm={8}>
        <Paper
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: message.type === "user" ? "#1976d2" : "#ece7e7",
            color: message.type === "user" ? "#ffffff" : "#000",
            borderRadius: "20px",
          }}
        >
          <ListItemText primary={message.text} />
        </Paper>
      </Grid>
    </Grid>
  );
}
