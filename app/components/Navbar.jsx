import React from "react";

function Navbar() {
  const isSignedIn = false;

  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-gray-900 to-purple-900 shadow-md p-4 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <p
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          
        >
          ProfsRated AI
        </p>
        <div className="flex items-center space-x-6">
          {isSignedIn ? (
            <p className="text-white"> hi </p>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <button className="text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg p-2 transition-all  cursor-pointer">
                  Sign In
                </button>
                <button className="bg-purple-700 text-white text-lg font-medium hover:bg-purple-800 rounded-lg p-2 transition-all  cursor-pointer">
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
