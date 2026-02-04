'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LearnerHeaderProps {
  title?: string;
}

export const LearnerHeader: React.FC<LearnerHeaderProps> = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: '1', title: 'New lesson available', message: 'Python Fundamentals - Week 3 is now available', time: '2h ago', unread: true },
    { id: '2', title: 'Assignment due soon', message: 'Data Structures assignment due in 2 days', time: '5h ago', unread: true },
    { id: '3', title: 'Certificate earned!', message: 'Congratulations on completing Python Basics', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white border-b border-[var(--gray-200)] px-6 lg:px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left - Title or Search */}
        <div className="flex items-center gap-4 flex-1">
          {title ? (
            <h1 className="text-xl font-semibold text-[var(--foreground)]">{title}</h1>
          ) : (
            <div className="relative max-w-md w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search courses, lessons..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] focus:bg-white focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xs text-amber-600 font-medium">7 Day Streak</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2.5 rounded-xl hover:bg-[var(--gray-100)] transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[var(--error)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[var(--gray-200)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[var(--gray-200)] flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                  <button className="text-sm text-[var(--primary-navy)] hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-[var(--gray-50)] cursor-pointer border-b border-[var(--gray-100)] last:border-0 ${notification.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[var(--primary-navy)] rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={notification.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-[var(--foreground)]">{notification.title}</p>
                          <p className="text-sm text-[var(--gray-500)] mt-0.5">{notification.message}</p>
                          <p className="text-xs text-[var(--gray-400)] mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-[var(--gray-200)] bg-[var(--gray-50)]">
                  <Link href="/notifications" className="text-sm text-[var(--primary-navy)] hover:underline font-medium">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-[var(--gray-100)] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] text-white flex items-center justify-center font-semibold text-sm">
                JD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[var(--foreground)]">John Doe</p>
                <p className="text-xs text-[var(--gray-500)]">Learner</p>
              </div>
              <svg className="w-4 h-4 text-[var(--gray-400)] hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--gray-200)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[var(--gray-200)]">
                  <p className="font-medium text-[var(--foreground)]">John Doe</p>
                  <p className="text-sm text-[var(--gray-500)]">john.doe@email.com</p>
                </div>
                <div className="py-2">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors">
                    <svg className="w-5 h-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <Link href="/certificates" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors">
                    <svg className="w-5 h-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    My Certificates
                  </Link>
                  <Link href="/profile#settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-100)] transition-colors">
                    <svg className="w-5 h-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                </div>
                <div className="border-t border-[var(--gray-200)] py-2">
                  <button
                    onClick={() => {
                      localStorage.removeItem('learner_token');
                      localStorage.removeItem('user_role');
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--error-light)] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
