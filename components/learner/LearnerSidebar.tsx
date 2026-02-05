'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    name: 'My Courses',
    href: '/courses',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },

  {
    name: 'Certificates',
    href: '/certificates',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    name: 'Achievements',
    href: '/achievements',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

const bottomMenuItems = [

  {
    name: 'Help & Support',
    href: '/support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export const LearnerSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`
        bg-white border-r border-[var(--gray-200)] flex flex-col h-screen fixed left-0 top-0 z-40
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Logo */}
      <div className={`px-4 py-4 border-b border-[var(--gray-200)] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-[var(--gray-200)]">
              <Image
                src="/logo.png"
                alt="Virtual Film Office"
                width={44}
                height={44}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm text-[var(--foreground)] leading-tight">VFO Academy</h1>
              <p className="text-xs text-[var(--gray-500)]">Learning Portal</p>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-[var(--gray-200)]">
            <Image
              src="/logo.png"
              alt="Virtual Film Office"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-500)] transition-colors ${isCollapsed ? 'absolute -right-3 top-6 bg-white border border-[var(--gray-200)] shadow-sm' : ''}`}
        >
          <svg className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-[var(--primary-navy)] text-white shadow-md'
                  : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-[var(--foreground)]'
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              {item.icon}
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-[var(--gray-200)] space-y-1.5">
        {bottomMenuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-[var(--gray-100)] text-[var(--foreground)]'
                  : 'text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-[var(--foreground)]'
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              {item.icon}
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={async () => {
            const { signOut } = await import('@/lib/services/auth.service');
            await signOut();
            window.location.href = '/login';
          }}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            text-[var(--error)] hover:bg-[var(--error-light)]
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
