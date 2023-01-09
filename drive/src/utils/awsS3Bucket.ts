import S3 from "aws-sdk/clients/s3";
import dotenv from "dotenv";
dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// AWS.config.update({
//     region,
//     accessKeyId,
//     secretAccessKey
// })

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

export const uploadFile = (fileStream:Buffer, fileName: string) => {

    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body:fileStream
    }
    return s3.upload(uploadParams).promise()
}

export const getFile = async (key:string) => {
    const getParams = {
        Bucket: bucketName,
        Key: key,
        // Expires:60,
        
    }
    // const data = await s3.getSignedUrl('getObject',getParams)
    const data = await s3.getSignedUrl('getObject', getParams)

    console.log(data);
    
    // const url = data.Body.toString('utf-8');
    // console.log(url);
    
    return data;

}