import { Pinecone } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null

// get pinecone client credentials

export const getPineconeClient = async () =>{
    return new Pinecone ({
        apiKey: process.env.PINECONE_API_KEY!,
        //environment: process.env.PINECONE_ENVIRONMENT!
    });
};

export async function loadS3IntoPinecone(file_key: String) {
    
}