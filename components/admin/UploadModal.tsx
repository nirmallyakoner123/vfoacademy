'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (fileName: string, fileType: 'video' | 'pdf') => void;
  lessonType: 'Video' | 'PDF';
}

export const UploadModal: React.FC<UploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload,
  lessonType 
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const fileType = lessonType === 'Video' ? 'video' : 'pdf';
            onUpload(selectedFile, fileType);
            handleClose();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleClose = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };
  
  const acceptedFormats = lessonType === 'Video' ? '.mp4,.mov,.avi,.mkv' : '.pdf';
  const fileIcon = lessonType === 'Video' ? (
    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ) : (
    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Upload ${lessonType}`}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {!selectedFile ? (
          <div className="border-2 border-dashed border-[var(--gray-300)] rounded-lg p-8 text-center hover:border-[var(--primary-navy)] transition-colors">
            <input
              type="file"
              id="file-upload"
              accept={acceptedFormats}
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                {fileIcon}
                <div>
                  <p className="text-lg font-medium text-[var(--foreground)] mb-1">
                    Drop your {lessonType.toLowerCase()} here or{' '}
                    <span className="text-[var(--primary-navy)] underline">browse</span>
                  </p>
                  <p className="text-sm text-[var(--gray-500)]">
                    Supported formats: {lessonType === 'Video' ? 'MP4, MOV, AVI, MKV' : 'PDF'}
                  </p>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="flex items-center gap-4 p-4 bg-[var(--gray-50)] rounded-lg border border-[var(--gray-200)]">
              <div className="flex-shrink-0">
                {fileIcon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--foreground)] truncate">{selectedFile}</p>
                <p className="text-sm text-[var(--gray-500)]">{lessonType} file</p>
              </div>
              {!isUploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="flex-shrink-0 text-[var(--error)] hover:text-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Upload Progress */}
            {isUploading && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--gray-600)]">Uploading...</span>
                  <span className="font-medium text-[var(--primary-navy)]">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[var(--gray-200)] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[var(--primary-navy)] h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
