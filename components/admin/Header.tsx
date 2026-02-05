'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const Header: React.FC<HeaderProps> = ({ title, breadcrumbs }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };
  
  return (
    <header className="bg-white border-b border-[var(--gray-200)] px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[var(--gray-500)] mb-1">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  <span className={index === breadcrumbs.length - 1 ? 'text-[var(--foreground)] font-medium' : ''}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
        </div>
        
        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--gray-100)] transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--foreground)]">{user?.full_name || 'Admin User'}</p>
              <p className="text-xs text-[var(--gray-500)]">{user?.email || 'admin@vfoacademy.com'}</p>
            </div>
            <div className="w-10 h-10 bg-[var(--primary-navy)] text-white rounded-full flex items-center justify-center font-semibold uppercase">
              {user?.full_name ? user.full_name.substring(0, 2) : 'AU'}
            </div>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--gray-200)] py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors">
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors">
                Preferences
              </button>
              <hr className="my-2 border-[var(--gray-200)]" />
              <button 
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-[var(--error)] hover:bg-[var(--error-light)] transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
