import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { getS3Url } from "@/lib/s3";

export async function POST(req: Request, res: Response) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { file_key, file_name } =  body;
        console.log(file_key, file_name);
        //const pages = await loadS3IntoPinecone(file_key);
        /*return NextResponse.json({pages});

        const chat_id = await db
            .insert(chats)
            .values({
                filekey: file_key,
                pdfName: file_name,
                pdfUrl: getS3Url(file_key),
                userId,
            })
            .returning({
                insertedId: chats.id,
            });

            return NextResponse.json({
                chat_id: chat_id[0].insertedId,
            },
            { status: 200 }
        );*/

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}