import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export default function Home() {
  return (
    <main className='flex min-h-screen background flex-col h-screen items-center justify-center'>
      <SignedOut>
        {/* Apply a custom class to the SignInButton */}
        <SignInButton mode="modal">
          <button className="custom-signin-button">Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center justify-center w-full">
          <Navbar />
          <UserButton />
          <ChatBox />
        </div>
      </SignedIn>
    </main>
  );
}
