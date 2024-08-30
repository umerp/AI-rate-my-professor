import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { query } = await req.json();

  try {
    // Initialize Pinecone
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index("rag").namespace("ns1");

    // Initialize OpenAI client
    const openai = new OpenAI();

    // Create embeddings for the  query
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      encoding_format: 'float',
    });

    // Search Pinecone index for top matches
    const results = await index.query({
      topK: 3,
      includeMetadata: true,
      vector: embedding.data[0].embedding,
    });

    // Prepare the response
    const topMatches = results.matches.map((match) => ({
      professor: match.id,
      review: match.metadata.review,
      subject: match.metadata.subject,
      stars: match.metadata.stars,
    }));

    return NextResponse.json(
      { success: true, topMatches },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing search query:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
