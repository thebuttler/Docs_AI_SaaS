import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone"
import { downloadFromS3 } from "./s3-server"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter" 
import { getEmbeddings } from "./embeddings"
import md5 from "md5"
import { convertToAscii } from "./utils"

// get pinecone client credentials
export const getPineconeClient = () =>{
    return new Pinecone ({
        apiKey: process.env.PINECONE_API_KEY!,
        // Pinecone no longer requires the environment to be part the the connection
        // latest SDK update connect to a global control plane instead. This meas a single
        // can now be hosted in indexes in different regions, and only the API key is needed.
        //environment: process.env.PINECONE_ENVIRONMENT!,
    });
};

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    };
};

export async function loadS3IntoPinecone(fileKey: string) {
    // a. Obtain the pdf from s3
    console.log('Downloading the pdf into the file system');
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error("Error downloading file from s3")
    }
    console.log("Loading pdf into memory" + file_name)
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    // b. Split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocumet));

    // c. vectorise and embed the segments
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // d. Upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("aipdftool");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    console.log("Inserting vectors into pinecone")
    await namespace.upsert(vectors);
    return documents[0];

}
async function embedDocument(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber,
            },
        } as PineconeRecord;
    } catch (error) {
        console.log("error while embedding document", error);
        throw error;
    }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocumet(page: PDFPage){
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, " ");
    // Split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document ({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            },
        }),
    ]);
    return docs;
}