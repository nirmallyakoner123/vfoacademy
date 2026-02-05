'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Courses', href: '/admin/courses', icon: 'courses' },
  { name: 'Users', href: '/admin/users', icon: 'users' },
  { name: 'Enrollments', href: '/admin/enrollments', icon: 'enrollments' },
  { name: 'Assessments', href: '/admin/assessments', icon: 'assessments' },
  { name: 'Reports', href: '/admin/reports', icon: 'reports' },
];

const icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  enrollments: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  assessments: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  reports: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 bg-[var(--primary-navy)] text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[var(--primary-navy-light)]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
            <Image
              src="/logo.png"
              alt="Virtual Film Office"
              width={48}
              height={48}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm leading-tight truncate">Virtual Film Office</h1>
            <p className="text-xs text-[var(--gold-accent)]">Admin Portal</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const isCoursesActive = pathname?.includes('/courses');
          const shouldHighlight = item.name === 'Courses' ? isCoursesActive : isActive;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${shouldHighlight
                  ? 'bg-[var(--gold-accent)] text-[var(--primary-navy)] font-semibold shadow-lg'
                  : 'text-white hover:bg-[var(--primary-navy-light)] hover:translate-x-1'
                }
              `}
            >
              {icons[item.icon as keyof typeof icons]}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-[var(--primary-navy-light)] space-y-4">
        <button 
          onClick={async () => {
            const { signOut } = await import('@/lib/services/auth.service');
            await signOut();
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-3 text-white/70 hover:text-white hover:bg-[var(--primary-navy-light)] px-4 py-2 rounded-lg w-full transition-all duration-200 group"
        >
          <svg className="w-5 h-5 group-hover:text-[var(--gold-accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
        <p className="text-xs text-[var(--gold-accent-light)] text-center">© 2026 Virtual Film Office</p>
      </div>
    </aside>
  );
};
