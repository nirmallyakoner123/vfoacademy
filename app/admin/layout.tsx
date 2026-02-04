import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | VFO Admin',
    default: 'VFO Academy - Admin Portal',
  },
  description: 'Admin portal for managing courses, users, and content.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
