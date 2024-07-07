import { S3 } from '@aws-sdk/client-s3';
import fs from "fs";

export async function downloadFromS3(file_key: string): Promise<string> {
    /*
    in summary this code downloads the file from s3 and savs it to the local file system,
    then it resolves a Promise with the name of the file. 
    */
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new S3({
                region: 'us-east-1',
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
                },
            });
            const params = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
                Key: file_key,
            };
    
            const obj = await s3.getObject(params);
            const file_name = `/tmp/file${Date.now().toString()}.pdf`;

            // Based on the recent errors aws-sdk v3 has issues with the Typescript definitions
            // We have a solution that for the mooment works
            // https://github.com/aws/aws-sdk-js-v3/issues/843

            if (obj.Body instanceof require("stream").Readable) {
                const file = fs.createWriteStream(file_name);
                file.on("open", function (fd) {
                // @ts-ignore
                    obj.Body?.pipe(file).on("finish", () => {
                        return resolve(file_name);
                    });
                });
            }
    
        } catch (error) {
            console.error(error);
            reject(error);
            return null;
        }
    }); 
}