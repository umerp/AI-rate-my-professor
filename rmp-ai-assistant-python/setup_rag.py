from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
import pandas as pd
import concurrent.futures

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
# Create a Pinecone index
pc.create_index(
    name="rag",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)
# Load the review data
csv_file = 'RateMyProfessor_Sample data.csv'
data = pd.read_csv(csv_file)
data = data.fillna("")

client = OpenAI()

batch_size = 100  # Process 100 rows at a time
processed_data = []

def generate_embedding(row):
    # Combine relevant text fields into a single input string for embedding
    review_text = f"Professor: {row['professor_name']}. School: {row['school_name']}. Department: {row['department_name']}. " \
                f"Rating: {row['star_rating']}/5.0. Difficulty: {row['diff_index']}/5.0. Tags: {row['tag_professor']}. " \
                f"Comment: {row['comments']}. Grades: {row['grades']}, Would Take Again: {row['would_take_agains']}"
    
    response =client.embeddings.create(
        input=review_text, model="text-embedding-3-small"
    )

    embedding = response.data[0].embedding
    return {
        "values": embedding,
        "id": f"professor-{row.name}",
        "metadata": {
            "professor_name": row['professor_name'],
            "school_name": row['school_name'],
            "department_name": row['department_name'],
            "star_rating": row['star_rating'],
            "difficulty": row['diff_index'],
            "tags": row['tag_professor'],
            "comment": row['comments'],
            "take_again": row['would_take_agains'],
            "attendance": row['attence'],
            "for_credit": row['for_credits'],
            "grade": row['grades'],
            "post_date": row['post_date']
        }
    }
    

def process_batch(batch):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(generate_embedding, [row for _, row in batch.iterrows()]))
    return results

def main():
    # Split data into batches
    for start in range(0, len(data), batch_size):
        batch = data.iloc[start:start + batch_size]
        processed_batch = process_batch(batch)
        processed_data.extend(processed_batch)

        # Upsert batch into Pinecone
        index = pc.Index("rag")
        upsert_response = index.upsert(
            vectors=processed_batch,
            namespace="ns1",
        )
        print(f"Upserted count for batch {start // batch_size + 1}: {upsert_response['upserted_count']}")

    # Print index statistics
    print(index.describe_index_stats())

# Run the main function
main()