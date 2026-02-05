'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LearnerSidebar } from './LearnerSidebar';
import { LearnerHeader } from './LearnerHeader';

interface LearnerLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const LearnerLayout: React.FC<LearnerLayoutProps> = ({ children, title }) => {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen bg-[var(--gray-50)]">
      <LearnerSidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-72 transition-all duration-300">
        <LearnerHeader title={title} />
        <main className="flex-1 overflow-y-auto">
          {/* Use pathname as key to force remount of children on route change */}
          <div key={pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
