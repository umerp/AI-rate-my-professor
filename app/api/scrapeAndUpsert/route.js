import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { auth, currentUser } from "@clerk/nextjs/server";
import { scrapeProfessorData } from "../../utils/scraper";

export async function POST(req) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { url } = await req.json();

  try {
    // Scrape the data using the scrapeProfessorData function
    const reviews = await scrapeProfessorData(url);

    // Initialize Pinecone
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index("rag").namespace("ns1");

    // Initialize OpenAI client
    const openai = new OpenAI();

    const processedData = [];
    for (const review of reviews) {
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: review.review,
        encoding_format: 'float',
      });

      processedData.push({
        values: embedding.data[0].embedding,
        id: `professor-${Date.now()}`,
        metadata: {
          review: review.review,
          subject: review.subject,
          stars: review.stars,
        },
      });
    }

    // Insert the embeddings into the Pinecone index
    const upsert_response = await index.upsert({
      vectors: processedData,
    });

    return NextResponse.json(
      { success: true, upsertedCount: upsert_response.upserted_count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error scraping and upserting data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
