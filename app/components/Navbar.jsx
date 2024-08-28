"use client";
import React, { useState } from "react";
import Image from "next/image";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SignOut from './SignOut'
import SignIn from './SignIn'

export default function Navbar({ session }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-gray-900 to-purple-900 shadow-md p-4 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent cursor-pointer">
          ProfsRated AI
        </p>
        <div className="flex items-center space-x-6">
          {session ? (
            <div>
              <IconButton onClick={handleClick}>
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <MenuItem type="submit">
                  <SignOut closeAnchor={handleClose}/>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </div>
  );
}
