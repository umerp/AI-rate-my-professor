import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox";
import { auth } from './auth'

export default async function Home() {
   const session = await auth();
  return (
    <main className='flex min-h-screen background flex-col h-screen items-center justify-center'>
      <Navbar session={session}  />
      <ChatBox session={session}/>
    </main>
  );
}
