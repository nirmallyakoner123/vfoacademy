'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, breadcrumbs }) => {
  const pathname = usePathname();

  const getPageInfo = (path: string) => {
    if (path.includes('/dashboard')) return { title: 'Dashboard', breadcrumbs: [] };
    if (path.includes('/courses/create')) return { title: 'Create Course', breadcrumbs: [{ label: 'Admin' }, { label: 'Courses', href: '/admin/courses' }, { label: 'Create' }] };
    if (path.includes('/courses')) return { title: 'Courses', breadcrumbs: [{ label: 'Admin' }, { label: 'Courses' }] };
    if (path.includes('/users')) return { title: 'Users', breadcrumbs: [{ label: 'Admin' }, { label: 'Users' }] };
    return { title: 'Admin Portal', breadcrumbs: [] };
  };

  const { title: autoTitle, breadcrumbs: autoBreadcrumbs } = getPageInfo(pathname || '');
  const displayTitle = title || autoTitle;
  const displayBreadcrumbs = breadcrumbs || autoBreadcrumbs;

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '256px' }}>
        <Header title={displayTitle} breadcrumbs={displayBreadcrumbs} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
