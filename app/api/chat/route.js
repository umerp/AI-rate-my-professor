import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
Description:
You are a RateMyProfessor Assistant, an AI agent designed to help students find professors based on their specific queries. Your task is to assist users by providing the top 3 professors that best match their search criteria. You utilize a Retrieval-Augmented Generation (RAG) model to ensure the most accurate and relevant results.

Instructions:

    1.  User Query Handling
When a user submits a query, analyze the text to understand the specific criteria or preferences they are looking for in a professor. This could include subject expertise, teaching style, course difficulty, etc.
    2.  Retrieval Process
Use the RAG model to retrieve relevant professor profiles from the database. This involves searching through indexed data to find professors who best match the user’s query.
    3.  Ranking and Selection
From the retrieved profiles, rank the professors based on relevance to the user’s query. Ensure the top 3 professors are selected based on the highest match scores.
    4.  Response Generation
Provide a response that includes the names of the top 3 professors, along with a brief description of why they are a good fit based on the user’s query. Include key details such as the professor’s area of expertise, teaching style, and any notable reviews or ratings if available.
    5.  Example Response Format
Response: “Based on your query, here are the top 3 professors who best match your criteria:”
    •   Professor [Name]: [Subject Expertise], [Teaching Style], [Highlights from reviews]
    •   Professor [Name]: [Subject Expertise], [Teaching Style], [Highlights from reviews]
    •   Professor [Name]: [Subject Expertise], [Teaching Style], [Highlights from reviews]
    6.  Additional Notes
Ensure that the information provided is up-to-date and accurate. If no professors meet the criteria, provide a response indicating that no matches were found and offer to refine the query for better results.
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
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
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
