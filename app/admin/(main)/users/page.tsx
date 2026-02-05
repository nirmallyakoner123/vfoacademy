'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AddUserModal } from '@/components/admin/AddUserModal';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;

        if (error) {
          console.error('Error fetching users:', error);
        } else if (data) {
          setUsers(data);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Unexpected error fetching users:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter(user => {
    const role = user.role || 'learner';
    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'Admins' && (role === 'admin' || role === 'super_admin' || role === 'instructor')) || 
                       (activeTab === 'Employees' && role === 'learner');
    
    // Safety check for null strings
    const name = user.full_name || '';
    const email = user.email || '';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddUser = async () => {
    // Refetch users after adding
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Error refetching users:', err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
                {/* <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-200)] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--gray-500)]">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--gray-50)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center font-bold text-sm uppercase">
                          {getInitials(user.full_name || 'U')}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--foreground)]">{user.full_name || 'Unknown'}</div>
                          <div className="text-sm text-[var(--gray-500)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                        ${user.role === 'admin' || user.role === 'super_admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      `}>
                        {user.role?.replace('_', ' ') || 'Learner'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.is_active ? 'success' : 'draft'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-500)]">
                      {formatDate(user.created_at)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[var(--primary-navy)] hover:text-[var(--primary-navy-light)] font-medium">
                        Edit
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--gray-500)]">
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
