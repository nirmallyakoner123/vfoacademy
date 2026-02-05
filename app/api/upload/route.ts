import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    // PDFs
    pdf: 'application/pdf',
    // Images
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
    // Check content type
    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError: any) {
      console.error('FormData parse error:', parseError);
      // This error usually means the file is too large or the request was interrupted
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to parse body as FormData. The file may be too large. Try using a smaller file or contact support.',
          details: parseError.message 
        },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';
    const courseId = formData.get('courseId') as string;
    const lessonId = formData.get('lessonId') as string;
    const type = formData.get('type') as string; // 'video', 'pdf', 'thumbnail'

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided or invalid file' },
        { status: 400 }
      );
    }

    // Check file size limit (100MB for API route, larger files should use presigned URL)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size for direct upload is 100MB. Please use a smaller file or configure S3 CORS for large file uploads.` 
        },
        { status: 413 }
      );
    }

    console.log('Upload request received:', {
      filename: file.name,
      size: file.size,
      type: file.type,
      courseId,
      lessonId,
      uploadType: type,
    });

    // Validate file type
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    const allowedPdfTypes = ['application/pdf'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid video format: ${file.type}. Allowed: MP4, WebM, MOV, AVI, MKV` },
        { status: 400 }
      );
    }

    if (type === 'pdf' && !allowedPdfTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Only PDF is allowed' },
        { status: 400 }
      );
    }

    if (type === 'thumbnail' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Build the folder path
    let uploadFolder = folder;
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
    const uniqueFilename = generateUniqueFilename(file.name);
    const key = `${BASE_PATH}/${uploadFolder}/${uniqueFilename}`;
    const fileContentType = file.type || getContentType(file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Uploading to S3:', { key, contentType: fileContentType, size: buffer.length });

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: fileContentType,
    });

    await s3Client.send(command);

    // Construct the public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION || 'us-east-2'}.amazonaws.com/${key}`;

    console.log('Upload successful:', { url });

    return NextResponse.json({
      success: true,
      url,
      key,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      contentType: fileContentType,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Next.js App Router config for handling large files
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time
