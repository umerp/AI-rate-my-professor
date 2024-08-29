import { NextResponse } from 'next/server';
import {db} from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { currentUser, auth } from '@clerk/nextjs/server'

export async function POST(req) {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }
  
    const user = await currentUser();
    const { messages } = await req.json();

    try {
      const userChatRef = doc(db, "chats", user.primaryEmailAddress);
      await setDoc(userChatRef, { messages }, { merge: true });
  
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error saving chat history:", error);
      return NextResponse.json(
        { success: false, error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

export async function GET(req) {
  const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }
  
    const user = await currentUser();

  try {
    const userDoc = doc(db, 'chats', user.primaryEmailAddress);
    const userChat = await getDoc(userDoc);
    
    if (userChat.exists()) {
        return NextResponse.json({ success: true, messages: userChat.data().messages }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, error: 'Chat history not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
