import AWS from "aws-sdk";
import fs from "fs";

export async function downloadFromS3(file_key: string) {
    try {
        const s3 = new AWS.S3({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            },
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            key: file_key,
        };

        const obj = await s3.getObject(params).promise();
        const file_name = `/tmp/file${Date.now().toString()}.pdf`;

        fs.writeFileSync(file_name, obj.Body as Buffer)
        return file_name;

    } catch (error) {
        console.error(error);
        //reject(error);
        return null;
    }
}