import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config/env.js';

const { storage } = config;

let s3Client = null;
if (storage.driver === 's3') {
    if (!storage.s3?.bucket) {
        console.warn('S3_BUCKET não definido. Uploads não funcionarão sem configurar o storage.');
    } else {
        s3Client = new S3Client({
            region: storage.s3.region,
            credentials:
                storage.s3.accessKeyId && storage.s3.secretAccessKey
                    ? {
                        accessKeyId: storage.s3.accessKeyId,
                        secretAccessKey: storage.s3.secretAccessKey,
                    }
                    : undefined,
        });
    }
}

const getPublicUrl = (key) => {
    if (storage.s3?.publicBaseUrl) {
        return `${storage.s3.publicBaseUrl.replace(/\/$/, '')}/${key}`;
    }
    const bucket = storage.s3.bucket;
    const region = storage.s3.region || 'us-east-1';
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const uploadBuffer = async ({ buffer, filename, folder = 'uploads', contentType }) => {
    if (storage.driver !== 's3' || !s3Client) {
        throw new Error('Storage não configurado corretamente.');
    }

    const extension = filename ? extname(filename) : '';
    const generatedName = `${randomUUID()}${extension}`;
    const key = `${folder.replace(/\/+$/g, '')}/${generatedName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: storage.s3.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }),
    );

    return {
        key,
        url: getPublicUrl(key),
        contentType,
        size: buffer.length,
    };
};
