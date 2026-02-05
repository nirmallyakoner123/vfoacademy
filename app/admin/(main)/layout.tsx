'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function MainAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Use pathname as key to force remount of children on route change
  return (
    <AdminLayout>
      <div key={pathname}>
        {children}
      </div>
    </AdminLayout>
  );
}
