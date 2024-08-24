import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function Loading() {
  return (
    <div className="relative flex flex-col h-full justify-center items-cente">
      <CircularProgress sx={{ color: "#4856b9" }} />
      <Typography variant="h6" sx={{ mt: 2, color: "#4856b9" }}>
      </Typography>
    </div>
  );
}

export default Loading;