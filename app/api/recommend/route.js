import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";

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
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index("rag").namespace("ns1");

    const openai = new OpenAI();

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


    const topMatches = results.matches.map((match) => ({
      professor: match.id,
      professor_name: match.metadata.professor_name,
      school_name: match.metadata.school_name,
      department_name: match.metadata.department_name,
      star_rating: match.metadata.star_rating,
      difficulty: match.metadata.difficulty,
      tags: match.metadata.tags,
      comment: match.metadata.comment,
      take_again: match.metadata.take_again,
      attendance: match.metadata.attendance,
      for_credit: match.metadata.for_credit,
      grade: match.metadata.grade,
      post_date: match.metadata.post_date,
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
