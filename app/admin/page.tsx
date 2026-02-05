'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-navy)]"></div>
        <p className="text-[var(--gray-500)] text-sm">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
