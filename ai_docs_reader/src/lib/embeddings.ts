import {OpenAIApi, Configuration} from "openai-edge"

// Open AI hits with insufficient quota when calling the api key directly
// TO-Do : increase rate limiter to send data and create the chat
const config = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: text.replace(/\n/g, " "),
        })
        console.log("Raw response", response);
        const result = await response.json();
        console.log("Parsed result", result);
        return result.data[0].embedding as number[];
    } catch (error) {
        console.log("Error trying to call open ai embeddings", error)
        throw error
    }
}