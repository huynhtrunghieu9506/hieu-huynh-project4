import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'}),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {

    }

    async getUrl(attachmentId: string): Promise<string> {
        const url = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
        return url
    }

    async getSignedUrl(attachmentId: string): Promise<string> {
        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: parseInt(this.urlExpiration)
        })

        return signedUrl
    }
}