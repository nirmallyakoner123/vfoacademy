'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AddUserModal } from '@/components/admin/AddUserModal';

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@vfo.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '01/15/2026',
    lastActive: 'Now',
    avatar: 'AU'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Learner',
    status: 'Active',
    joinedDate: '02/01/2026',
    lastActive: '2 hours ago',
    avatar: 'SJ'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    role: 'Learner',
    status: 'Inactive',
    joinedDate: '01/20/2026',
    lastActive: '5 days ago',
    avatar: 'MC'
  },
  {
    id: 4,
    name: 'David Smith',
    email: 'david.s@example.com',
    role: 'Learner',
    status: 'Active',
    joinedDate: '01/28/2026',
    lastActive: '1 day ago',
    avatar: 'DS'
  },
  {
    id: 5,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'Learner',
    status: 'Active',
    joinedDate: '02/03/2026',
    lastActive: '30 mins ago',
    avatar: 'ED'
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'Admins' && user.role === 'Admin') || 
                       (activeTab === 'Employees' && user.role === 'Learner');
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddUser = (newUser: any) => {
    const user = {
      id: users.length + 1,
      ...newUser,
      avatar: newUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    };
    setUsers([user, ...users]);
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
          <p className="text-[var(--gray-500)]">Manage academy administrators and employees</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </Button>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--gray-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[var(--gray-100)] p-1 rounded-lg">
            {['All', 'Admins', 'Employees'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-1.5 text-sm font-medium rounded-md transition-all
                  ${activeTab === tab 
                    ? 'bg-white text-[var(--foreground)] shadow-sm' 
                    : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              className="py-2 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-200)] bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--gray-50)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center font-bold text-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--foreground)]">{user.name}</div>
                          <div className="text-sm text-[var(--gray-500)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${user.role === 'Admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      `}>
                        {user.role === 'Learner' ? 'Employee' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.status === 'Active' ? 'success' : 'draft'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-500)]">
                      {user.joinedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-500)]">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[var(--primary-navy)] hover:text-[var(--primary-navy-light)] font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--gray-500)]">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddUser}
      />
    </div>
  );
}
