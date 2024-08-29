import React from "react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-gray-900 to-purple-900 shadow-md p-4 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent cursor-pointer">
          ProfsRated AI
        </p>
        <UserButton />
      </div>
    </div>
  );
}
