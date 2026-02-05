
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface LearnerHeaderProps {
  title?: string;
}

export const LearnerHeader: React.FC<LearnerHeaderProps> = ({ title }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };



  return (
    <header className="bg-white border-b border-[var(--gray-200)] px-6 lg:px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left - Title or Search */}
        <div className="flex items-center gap-4 flex-1">
          {title ? (
            <h1 className="text-xl font-semibold text-[var(--foreground)]">{title}</h1>
          ) : (
            <div className="relative max-w-md w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search courses, lessons..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] focus:bg-white focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xs text-amber-600 font-medium">7 Day Streak</p>
            </div>
          </div>



          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-[var(--gray-100)] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] text-white flex items-center justify-center font-semibold text-sm uppercase">
                {user?.full_name ? user.full_name.substring(0, 2) : 'LD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[var(--foreground)]">{user?.full_name || 'Learner User'}</p>
                <p className="text-xs text-[var(--gray-500)]">Learner</p>
              </div>
              <svg className="w-4 h-4 text-[var(--gray-400)] hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--gray-200)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[var(--gray-200)]">
                  <p className="font-medium text-[var(--foreground)]">{user?.full_name || 'Learner User'}</p>
                  <p className="text-sm text-[var(--gray-500)]">{user?.email || 'learner@vfoacademy.com'}</p>
                </div>
                <div className="py-2">
                  <Link href="/certificates" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors">
                    <svg className="w-5 h-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    My Certificates
                  </Link>
                </div>
                <div className="border-t border-[var(--gray-200)] py-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-light)] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
