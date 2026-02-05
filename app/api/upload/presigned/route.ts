import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'interview-screener';
const BASE_PATH = 'vfo-academy';

/**
 * Generate a unique filename with timestamp
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${baseName}_${timestamp}_${randomStr}.${extension}`;
}

/**
 * Get content type based on file extension
 */
function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return contentTypes[extension || ''] || 'application/octet-stream';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, courseId, lessonId, type } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Build the folder path
    let uploadFolder = 'uploads';
    if (courseId) {
      if (type === 'video') {
        uploadFolder = lessonId 
          ? `courses/${courseId}/lessons/${lessonId}/videos`
          : `courses/${courseId}/videos`;
      } else if (type === 'pdf') {
        uploadFolder = lessonId 
          ? `courses/${courseId}/lessons/${lessonId}/pdfs`
          : `courses/${courseId}/pdfs`;
      } else if (type === 'thumbnail') {
        uploadFolder = `courses/${courseId}/thumbnails`;
      }
    }

    // Generate unique filename and key
    const uniqueFilename = generateUniqueFilename(filename);
    const key = `${BASE_PATH}/${uploadFolder}/${uniqueFilename}`;
    const contentType = getContentType(filename);

    // Generate presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION || 'us-east-2'}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
      filename: uniqueFilename,
      contentType,
    });

  } catch (error: any) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
