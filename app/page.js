import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen background flex-col h-screen items-center justify-center">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="custom-signin-button">Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center justify-center w-full">
          <Navbar />
          <ChatBox />
        </div>
      </SignedIn>
    </main>
  );
}
