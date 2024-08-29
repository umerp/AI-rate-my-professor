import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Loading() {
  return (
    <div className="relative flex flex-col h-full justify-center items-center">
      <CircularProgress size="2rem" color="inherit" />
    </div>
  );
}

export default Loading;
