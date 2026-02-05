'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EnrollLearnerModal } from '@/components/admin/EnrollLearnerModal';
import * as enrollmentService from '@/lib/services/enrollment.service';
import type { EnrollmentWithDetails } from '@/lib/services/enrollment.service';
import toast from 'react-hot-toast';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      const result = await enrollmentService.getAllEnrollments();
      
      if (result.success && result.data) {
        setEnrollments(result.data);
      } else {
        console.error('Error fetching enrollments:', result.error);
        toast.error('Failed to load enrollments');
      }
    } catch (err) {
      console.error('Unexpected error fetching enrollments:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter(enrollment => {
    const status = enrollment.status || 'active';
    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'Active' && status === 'active') ||
                       (activeTab === 'Completed' && status === 'completed') ||
                       (activeTab === 'Suspended' && (status === 'suspended' || status === 'dropped'));
    
    const learnerName = enrollment.learner?.full_name || '';
    const learnerEmail = enrollment.learner?.email || '';
    const courseTitle = enrollment.course?.title || '';
    
    const matchesSearch = learnerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          learnerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = async (enrollmentId: string, newStatus: 'active' | 'completed' | 'dropped' | 'suspended') => {
    const result = await enrollmentService.updateEnrollmentStatus(enrollmentId, newStatus);
    if (result.success) {
      toast.success(`Enrollment status updated to ${newStatus}`);
      fetchEnrollments();
    } else {
      toast.error(`Failed to update status: ${result.error}`);
    }
  };

  const handleUnenroll = async (enrollmentId: string, learnerName: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to unenroll "${learnerName}" from "${courseTitle}"? This will also delete their progress.`)) {
      return;
    }

    const result = await enrollmentService.unenrollLearner(enrollmentId);
    if (result.success) {
      toast.success('Learner unenrolled successfully');
      fetchEnrollments();
    } else {
      toast.error(`Failed to unenroll: ${result.error}`);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'suspended': return 'warning';
      case 'dropped': return 'draft';
      default: return 'draft';
    }
  };

  // Stats
  const stats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.status === 'active').length,
    completed: enrollments.filter(e => e.status === 'completed').length,
    suspended: enrollments.filter(e => e.status === 'suspended' || e.status === 'dropped').length,
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Enrollments</h1>
          <p className="text-[var(--gray-500)]">Manage course enrollments for learners</p>
        </div>
        <Button variant="primary" onClick={() => setIsEnrollModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Enroll Learners
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
              <p className="text-sm text-[var(--gray-500)]">Total Enrollments</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.active}</p>
              <p className="text-sm text-[var(--gray-500)]">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.completed}</p>
              <p className="text-sm text-[var(--gray-500)]">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.suspended}</p>
              <p className="text-sm text-[var(--gray-500)]">Suspended/Dropped</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--gray-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[var(--gray-100)] p-1 rounded-lg">
            {['All', 'Active', 'Completed', 'Suspended'].map((tab) => (
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
          
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by learner or course..."
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Learner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-200)] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-[var(--primary-navy)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-[var(--gray-500)]">Loading enrollments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEnrollments.length > 0 ? (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-[var(--gray-50)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center font-bold text-sm uppercase">
                          {getInitials(enrollment.learner?.full_name || 'U')}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--foreground)]">{enrollment.learner?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-[var(--gray-500)]">{enrollment.learner?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-[var(--foreground)] truncate">{enrollment.course?.title || 'Unknown Course'}</div>
                        <div className="text-sm text-[var(--gray-500)]">{enrollment.course?.category || 'General'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-[var(--gray-200)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--primary-navy)] rounded-full transition-all"
                            style={{ width: `${enrollment.progress_percentage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[var(--gray-600)]">
                          {enrollment.progress_percentage || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                        {enrollment.status || 'active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-500)]">
                      {formatDate(enrollment.enrolled_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={enrollment.status || 'active'}
                          onChange={(e) => handleStatusChange(enrollment.id, e.target.value as any)}
                          className="text-sm border border-[var(--gray-300)] rounded-lg px-2 py-1 focus:border-[var(--primary-navy)] focus:ring-1 focus:ring-[var(--primary-navy)]"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="suspended">Suspended</option>
                          <option value="dropped">Dropped</option>
                        </select>
                        <button
                          onClick={() => handleUnenroll(
                            enrollment.id, 
                            enrollment.learner?.full_name || 'Unknown',
                            enrollment.course?.title || 'Unknown'
                          )}
                          className="p-2 text-[var(--error)] hover:bg-red-50 rounded-lg transition-colors"
                          title="Unenroll"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-[var(--gray-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <p className="text-[var(--gray-500)]">
                      {searchQuery || activeTab !== 'All' 
                        ? 'No enrollments found matching your criteria.' 
                        : 'No enrollments yet. Click "Enroll Learners" to get started.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <EnrollLearnerModal 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
        onEnroll={fetchEnrollments}
      />
    </div>
  );
}
