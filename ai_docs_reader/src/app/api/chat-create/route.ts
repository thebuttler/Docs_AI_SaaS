import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { file_key, file_name } =  body;
        console.log(file_key, file_name);
        await loadS3IntoPinecone(file_key);
        return NextResponse.json({message: "Success"});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}