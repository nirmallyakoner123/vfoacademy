'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data for stats
  const stats = [
    { 
      label: 'Total Courses', 
      value: '12', 
      change: '+2 this month', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    { 
      label: 'Total Users', 
      value: '245', 
      change: '+18 this week', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    { 
      label: 'Active Learners', 
      value: '180', 
      change: '+5% vs last month', 
      trend: 'up',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    { 
      label: 'Completion Rate', 
      value: '85%', 
      change: '-2% vs last month', 
      trend: 'down',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500'
    }
  ];

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, user: 'Sarah Johnson', action: 'completed', target: 'Introduction to Cinematography', time: '2 hours ago', avatar: 'SJ' },
    { id: 2, user: 'Michael Chen', action: 'joined', target: 'Virtual Film Office Academy', time: '5 hours ago', avatar: 'MC' },
    { id: 3, user: 'David Smith', action: 'started', target: 'Safety Protocols 101', time: '1 day ago', avatar: 'DS' },
    { id: 4, user: 'Emily Davis', action: 'completed', target: 'Equipment Handling', time: '1 day ago', avatar: 'ED' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--gray-500)]">Overview of academy performance</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/courses/create">
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Course
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-[var(--gray-200)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[var(--gray-500)]">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-90 shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center text-xs font-medium">
              <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-[var(--gray-200)] flex justify-between items-center">
              <h3 className="font-semibold text-lg text-[var(--foreground)]">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-[var(--gray-100)]">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-[var(--gray-50)] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center font-bold text-sm">
                    {activity.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      <span className="font-semibold">{activity.user}</span>
                      {' '}{activity.action === 'joined' ? 'joined the academy' : `${activity.action} ${activity.target}`}
                    </p>
                    <p className="text-xs text-[var(--gray-400)] mt-0.5">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.action === 'completed' ? 'success' :
                    activity.action === 'joined' ? 'info' :
                    'video'
                  }>
                    {activity.action}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Links / Shortcuts */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6 border-b border-[var(--gray-200)]">
              <h3 className="font-semibold text-lg text-[var(--foreground)]">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transaction-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">Manage Courses</h4>
                    <p className="text-xs text-[var(--gray-500)]">Edit or publish content</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transaction-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">Manage Users</h4>
                    <p className="text-xs text-[var(--gray-500)]">Add or remove learners</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transaction-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">View Reports</h4>
                    <p className="text-xs text-[var(--gray-500)]">Analyze performance</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant }: { children: React.ReactNode, variant: string }) {
  const styles = {
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    video: 'bg-indigo-100 text-indigo-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant as keyof typeof styles] || 'bg-gray-100'}`}>
      {children}
    </span>
  );
}
