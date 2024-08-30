import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
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
    const reviews = await scrapeProfessorData(url);

    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index("rag").namespace("ns1");

    const openai = new OpenAI();

    const processedData = [];
    for (const review of reviews) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: review.review,
        encoding_format: "float",
      });

      processedData.push({
        values: embedding.data[0].embedding,
        id: `professor-${Date.now()}`,
        metadata: {
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
        },
      });
    }


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
