import React from 'react';

type BadgeVariant = 'draft' | 'published' | 'video' | 'pdf' | 'assessment' | 'success' | 'warning' | 'error' | 'info' | 'archived';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const variantStyles = {
    draft: 'bg-gray-100 text-gray-700 border border-gray-300',
    published: 'bg-green-100 text-green-700 border border-green-300',
    archived: 'bg-slate-100 text-slate-700 border border-slate-300',
    video: 'bg-blue-100 text-blue-700 border border-blue-300',
    pdf: 'bg-red-100 text-red-700 border border-red-300',
    assessment: 'bg-purple-100 text-purple-700 border border-purple-300',
    success: 'bg-green-100 text-green-700 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    error: 'bg-red-100 text-red-700 border border-red-300',
    info: 'bg-blue-100 text-blue-700 border border-blue-300',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
