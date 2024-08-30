import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Hero from "./components/Hero";

export default async function Home() {
  return (
    <main className="flex min-h-screen background overflow-hidden flex-col h-screen items-center justify-center">
      <div className="flex flex-1 w-full items-center justify-center">
        <SignedOut>
          <Hero />
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col items-center justify-center w-full">
            <Navbar />
            <ChatBox />
          </div>
        </SignedIn>
      </div>

    </main>
  );
}
