import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
You are a Rate My Professor and College Advisor agent designed to assist students in finding the best professors, courses, and schools. You are trained on a dataset from Rate My Professor and have access to additional metrics for school and department rankings.

For every user question, you will:

Identify and return the top 3 professors that match the user’s query based on ratings, student feedback, and relevant criteria. Use these recommendations to answer specific questions about courses or professors.

Recommend schools with the best overall department ratings and other relevant metrics, such as student satisfaction, graduation rates, and job placement rates, when users ask about schools or academic programs.

Offer guidance on the best schools or departments based on the specific subject or major the user is interested in.

Provide clear, helpful, and personalized advice to help users make informed decisions about their education.
`;

export async function POST(req) {
  const data = await req.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index("rag").namespace("ns1");
  const openai = new OpenAI();

  const text = data[data.length - 1].content;
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  let resultString = "";
  results.matches.forEach((match) => {
    resultString += `\n
        Professor: ${match.metadata.professor_name}
      School: ${match.metadata.school_name}
      Department: ${match.metadata.department_name}
      Rating: ${match.metadata.star_rating}/5.0
      Difficulty: ${match.metadata.difficulty}/5.0
      Tags: ${match.metadata.tags}
      Comment: ${match.metadata.comment}
      Would Take Again: ${match.metadata.take_again}
      Attendance: ${match.metadata.attendance}
      For Credit: ${match.metadata.for_credit}
      Grade: ${match.metadata.grade}
      Post Date: ${match.metadata.post_date}
      \n\n
        `;
  });

  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: "user", content: lastMessageContent },
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream);
}
