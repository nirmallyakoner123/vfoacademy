'use client';

import React, { useState } from 'react';
import { LearnerLayout } from '@/components/learner/LearnerLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
];

// Mock user data
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  bio: 'Passionate learner interested in film production and programming. Currently working on building my skills in Python and video editing.',
  location: 'New York, USA',
  timezone: 'America/New_York',
  language: 'English',
  joinedAt: new Date('2025-11-15'),
  socialLinks: {
    linkedin: 'linkedin.com/in/johndoe',
    twitter: '@johndoe',
    website: 'johndoe.com',
  },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState(userData);
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    emailCourseUpdates: true,
    emailNewCourses: true,
    emailPromotions: false,
    emailWeeklyDigest: true,
    pushReminders: true,
    pushAchievements: true,
    pushMessages: true,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <LearnerLayout title="Settings">
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] text-white flex items-center justify-center text-3xl font-bold">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary-navy)] text-white rounded-full flex items-center justify-center hover:bg-[var(--primary-navy-dark)] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-[var(--gray-500)]">{formData.email}</p>
                <p className="text-sm text-[var(--gray-400)] mt-1">
                  Member since {userData.joinedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Public Profile
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
            <div className="px-6 pt-4 border-b border-[var(--gray-200)]">
              <Tabs tabs={tabs} defaultTab="profile" onChange={setActiveTab} />
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-[var(--foreground)] mb-2.5">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3.5 rounded-xl border border-[var(--gray-300)] focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 transition-all text-base resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                    />
                    <div>
                      <label className="block text-sm font-semibold text-[var(--foreground)] mb-2.5">
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-[var(--gray-300)] focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 transition-all text-base"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Asia/Kolkata">India (IST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--gray-200)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Social Links</h3>
                    <div className="space-y-4">
                      <Input
                        label="LinkedIn"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                        placeholder="linkedin.com/in/username"
                      />
                      <Input
                        label="Twitter"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                        placeholder="@username"
                      />
                      <Input
                        label="Website"
                        value={formData.socialLinks.website}
                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, website: e.target.value } })}
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                        showPasswordToggle
                      />
                      <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        showPasswordToggle
                        helperText="Password must be at least 8 characters"
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                        showPasswordToggle
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--gray-200)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-xl">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">Authenticator App</p>
                        <p className="text-sm text-[var(--gray-500)]">Use an authenticator app to generate codes</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--gray-200)]">
                    <h3 className="font-semibold text-[var(--error)] mb-4">Danger Zone</h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--error)]">Delete Account</p>
                          <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="danger" size="sm">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailCourseUpdates', label: 'Course Updates', description: 'Get notified when courses you are enrolled in are updated' },
                        { key: 'emailNewCourses', label: 'New Courses', description: 'Be the first to know about new course releases' },
                        { key: 'emailPromotions', label: 'Promotions', description: 'Receive promotional offers and discounts' },
                        { key: 'emailWeeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of your learning progress' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-xl">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">{item.label}</p>
                            <p className="text-sm text-[var(--gray-500)]">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--gray-300)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-navy)]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--gray-200)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'pushReminders', label: 'Learning Reminders', description: 'Get reminded to continue your learning' },
                        { key: 'pushAchievements', label: 'Achievements', description: 'Get notified when you earn achievements' },
                        { key: 'pushMessages', label: 'Messages', description: 'Get notified about new messages' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-xl">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">{item.label}</p>
                            <p className="text-sm text-[var(--gray-500)]">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--gray-300)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-navy)]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Profile Visibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-xl">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">Public Profile</p>
                          <p className="text-sm text-[var(--gray-500)]">Allow others to see your profile and achievements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-[var(--gray-300)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-navy)]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-xl">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">Show Certificates</p>
                          <p className="text-sm text-[var(--gray-500)]">Display your earned certificates on your profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-[var(--gray-300)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-navy)]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-xl">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">Show Learning Activity</p>
                          <p className="text-sm text-[var(--gray-500)]">Display your course progress and activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-[var(--gray-300)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-navy)]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--gray-200)]">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Data & Privacy</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Privacy Policy
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 mt-6 border-t border-[var(--gray-200)]">
                <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearnerLayout>
  );
}
