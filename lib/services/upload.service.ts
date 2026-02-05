/**
 * Client-side upload service for videos and PDFs
 * Uses the API routes to upload files to S3
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  filename?: string;
  error?: string;
}

/**
 * Upload a file using the standard upload API
 * Uses XMLHttpRequest for progress tracking
 */
export async function uploadFile(
  file: File,
  options: {
    type: 'video' | 'pdf' | 'thumbnail';
    courseId?: string;
    lessonId?: string;
    onProgress?: (progress: UploadProgress) => void;
  }
): Promise<UploadResult> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', options.type);

    if (options.courseId) {
      formData.append('courseId', options.courseId);
    }
    if (options.lessonId) {
      formData.append('lessonId', options.lessonId);
    }

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const result = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300 && result.success) {
          resolve({
            success: true,
            url: result.url,
            key: result.key,
            filename: result.filename,
          });
        } else {
          resolve({
            success: false,
            error: result.error || `Upload failed with status ${xhr.status}`,
          });
        }
      } catch (e) {
        resolve({
          success: false,
          error: 'Failed to parse server response',
        });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({
        success: false,
        error: 'Upload failed due to network error',
      });
    });

    xhr.addEventListener('abort', () => {
      resolve({
        success: false,
        error: 'Upload was cancelled',
      });
    });

    xhr.addEventListener('timeout', () => {
      resolve({
        success: false,
        error: 'Upload timed out. The file may be too large.',
      });
    });

    xhr.open('POST', '/api/upload');
    xhr.timeout = 600000; // 10 minute timeout for large files
    xhr.send(formData);
  });
}

/**
 * Upload a large file using presigned URL
 * Better for larger files as it uploads directly to S3
 */
export async function uploadLargeFile(
  file: File,
  options: {
    type: 'video' | 'pdf' | 'thumbnail';
    courseId?: string;
    lessonId?: string;
    onProgress?: (progress: UploadProgress) => void;
  }
): Promise<UploadResult> {
  try {
    // Step 1: Get presigned URL
    const presignedResponse = await fetch('/api/upload/presigned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        type: options.type,
        courseId: options.courseId,
        lessonId: options.lessonId,
      }),
    });

    const presignedResult = await presignedResponse.json();

    if (!presignedResponse.ok || !presignedResult.success) {
      return {
        success: false,
        error: presignedResult.error || 'Failed to get upload URL',
      };
    }

    // Step 2: Upload directly to S3 using presigned URL
    const xhr = new XMLHttpRequest();

    const uploadPromise = new Promise<UploadResult>((resolve) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          options.onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            success: true,
            url: presignedResult.publicUrl,
            key: presignedResult.key,
            filename: presignedResult.filename,
          });
        } else {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`,
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Upload failed due to network error',
        });
      });

      xhr.addEventListener('abort', () => {
        resolve({
          success: false,
          error: 'Upload was cancelled',
        });
      });
    });

    xhr.open('PUT', presignedResult.uploadUrl);
    xhr.setRequestHeader('Content-Type', presignedResult.contentType);
    xhr.send(file);

    return await uploadPromise;
  } catch (error: any) {
    console.error('Large file upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

/**
 * Smart upload function that chooses the best method based on file size
 * Uses standard upload for files < 10MB, presigned URL for larger files
 * 
 * NOTE: Presigned URL uploads require CORS configuration on the S3 bucket.
 * If you get CORS errors, either:
 * 1. Configure CORS on your S3 bucket (recommended)
 * 2. Set usePresignedUrl to false to always use the API route
 */
export async function smartUpload(
  file: File,
  options: {
    type: 'video' | 'pdf' | 'thumbnail';
    courseId?: string;
    lessonId?: string;
    onProgress?: (progress: UploadProgress) => void;
    usePresignedUrl?: boolean; // Set to false to disable presigned URL uploads
  }
): Promise<UploadResult> {
  const TEN_MB = 10 * 1024 * 1024;

  // Default to using presigned URL for better performance and to avoid server limits
  const usePresigned = options.usePresignedUrl ?? true;

  if (usePresigned && file.size > TEN_MB) {
    return uploadLargeFile(file, options);
  } else {
    return uploadFile(file, options);
  }
}

/**
 * Upload video helper
 */
export async function uploadVideo(
  file: File,
  courseId: string,
  lessonId?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return smartUpload(file, {
    type: 'video',
    courseId,
    lessonId,
    onProgress,
  });
}

/**
 * Upload PDF helper
 */
export async function uploadPDF(
  file: File,
  courseId: string,
  lessonId?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return smartUpload(file, {
    type: 'pdf',
    courseId,
    lessonId,
    onProgress,
  });
}

/**
 * Upload thumbnail helper
 */
export async function uploadThumbnail(
  file: File,
  courseId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return smartUpload(file, {
    type: 'thumbnail',
    courseId,
    onProgress,
  });
}

/**
 * Validate file before upload
 * Note: Direct API uploads are limited to 100MB. For larger files, S3 CORS must be configured.
 */
export function validateFile(
  file: File,
  type: 'video' | 'pdf' | 'thumbnail'
): { valid: boolean; error?: string } {
  // For direct API uploads, limit to 100MB to avoid timeout/memory issues
  const maxSizes = {
    video: 100 * 1024 * 1024, // 100MB (limited for API route)
    pdf: 50 * 1024 * 1024, // 50MB
    thumbnail: 5 * 1024 * 1024, // 5MB
  };

  const allowedTypes = {
    video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'],
    pdf: ['application/pdf'],
    thumbnail: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  };

  if (file.size > maxSizes[type]) {
    const maxMB = maxSizes[type] / (1024 * 1024);
    const fileSizeMB = Math.round(file.size / (1024 * 1024));
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds ${maxMB}MB limit. Please compress the video or use a smaller file.`,
    };
  }

  if (!allowedTypes[type].includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Allowed: ${type === 'video' ? 'MP4, WebM, MOV, AVI, MKV' : type === 'pdf' ? 'PDF' : 'JPEG, PNG, GIF, WebP'}`,
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
