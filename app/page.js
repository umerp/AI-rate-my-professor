import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";

export default function Home() {
  return (
    <main className='flex min-h-screen background flex-col h-screen items-center justify-center'>
      <Navbar />
      <ChatBox />
    </main>
  );
}
