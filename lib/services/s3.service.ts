import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
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
const BASE_PATH = 'vfo-academy'; // Base path for all uploads

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

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
    // Documents
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return contentTypes[extension || ''] || 'application/octet-stream';
}

/**
 * Upload a file to S3
 * @param file - The file buffer or base64 string
 * @param filename - Original filename
 * @param folder - Subfolder path (e.g., 'courses/course-id/lessons')
 * @returns Upload result with URL
 */
export async function uploadFile(
  file: Buffer | string,
  filename: string,
  folder: string
): Promise<UploadResult> {
  try {
    const uniqueFilename = generateUniqueFilename(filename);
    const key = `${BASE_PATH}/${folder}/${uniqueFilename}`;
    const contentType = getContentType(filename);

    // Convert base64 to buffer if needed
    let fileBuffer: Buffer;
    if (typeof file === 'string') {
      // Remove data URL prefix if present
      const base64Data = file.replace(/^data:[^;]+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      fileBuffer = file;
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      // Make the file publicly readable
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Construct the public URL
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION || 'us-east-2'}.amazonaws.com/${key}`;

    return {
      success: true,
      url,
      key,
    };
  } catch (error: any) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    };
  }
}

/**
 * Upload a video file
 */
export async function uploadVideo(
  file: Buffer | string,
  filename: string,
  courseId: string,
  lessonId?: string
): Promise<UploadResult> {
  const folder = lessonId 
    ? `courses/${courseId}/lessons/${lessonId}/videos`
    : `courses/${courseId}/videos`;
  return uploadFile(file, filename, folder);
}

/**
 * Upload a PDF file
 */
export async function uploadPDF(
  file: Buffer | string,
  filename: string,
  courseId: string,
  lessonId?: string
): Promise<UploadResult> {
  const folder = lessonId 
    ? `courses/${courseId}/lessons/${lessonId}/pdfs`
    : `courses/${courseId}/pdfs`;
  return uploadFile(file, filename, folder);
}

/**
 * Upload a course thumbnail
 */
export async function uploadThumbnail(
  file: Buffer | string,
  filename: string,
  courseId: string
): Promise<UploadResult> {
  const folder = `courses/${courseId}/thumbnails`;
  return uploadFile(file, filename, folder);
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error: any) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete file',
    };
  }
}

/**
 * Generate a presigned URL for direct upload from browser
 * This is useful for large files to avoid server memory issues
 */
export async function getPresignedUploadUrl(
  filename: string,
  folder: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; uploadUrl?: string; key?: string; publicUrl?: string; error?: string }> {
  try {
    const uniqueFilename = generateUniqueFilename(filename);
    const key = `${BASE_PATH}/${folder}/${uniqueFilename}`;
    const contentType = getContentType(filename);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION || 'us-east-2'}.amazonaws.com/${key}`;

    return {
      success: true,
      uploadUrl,
      key,
      publicUrl,
    };
  } catch (error: any) {
    console.error('S3 presigned URL error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate presigned URL',
    };
  }
}

/**
 * Generate a presigned URL for downloading/viewing a file
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      url,
    };
  } catch (error: any) {
    console.error('S3 presigned download URL error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate presigned URL',
    };
  }
}
