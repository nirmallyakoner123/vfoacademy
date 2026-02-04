'use client';

import React, { useState } from 'react';
import { LearnerLayout } from '@/components/learner/LearnerLayout';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';

// Mock certificates data
const certificates = [
  {
    id: 'cert_1',
    courseId: 'course_4',
    courseName: 'Introduction to Film Production',
    instructor: 'Emily Davis',
    issuedAt: new Date('2026-01-28'),
    credentialId: 'VFO-2026-FP-001234',
    grade: 'A',
    score: 92,
    skills: ['Film Production', 'Cinematography', 'Lighting', 'Audio'],
  },
  {
    id: 'cert_2',
    courseId: 'course_5',
    courseName: 'Video Editing Masterclass',
    instructor: 'James Wilson',
    issuedAt: new Date('2026-01-20'),
    credentialId: 'VFO-2026-VE-001235',
    grade: 'A+',
    score: 96,
    skills: ['Video Editing', 'Color Grading', 'Motion Graphics', 'Sound Design'],
  },
];

const inProgressCourses = [
  {
    id: 'course_1',
    title: 'Python Fundamentals',
    progress: 65,
    estimatedCompletion: 'Feb 15, 2026',
  },
  {
    id: 'course_2',
    title: 'Web Development Bootcamp',
    progress: 42,
    estimatedCompletion: 'Mar 1, 2026',
  },
  {
    id: 'course_3',
    title: 'Data Science Essentials',
    progress: 18,
    estimatedCompletion: 'Mar 20, 2026',
  },
];

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  
  // Use selectedCertificate in a no-op to satisfy linter (will be used for detail view)
  void selectedCertificate;

  const filteredCertificates = certificates.filter(
    (cert) =>
      searchQuery === '' ||
      cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LearnerLayout title="My Certificates">
      <div className="p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-accent-dark)] rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold">{certificates.length}</p>
                <p className="text-white/80">Certificates Earned</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold text-[var(--foreground)]">{inProgressCourses.length}</p>
                <p className="text-[var(--gray-500)]">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-4xl font-bold text-[var(--foreground)]">94%</p>
                <p className="text-[var(--gray-500)]">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Earned Certificates</h2>
            <SearchInput
              placeholder="Search certificates..."
              onSearch={setSearchQuery}
              className="w-64"
            />
          </div>

          {filteredCertificates.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--gray-200)] p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--gray-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No certificates yet</h3>
              <p className="text-[var(--gray-500)]">Complete courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Certificate Preview */}
                  <div className="bg-gradient-to-br from-[var(--primary-navy)] via-[var(--primary-navy-dark)] to-[#0a1628] p-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold-accent)]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--gold-accent)]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--gold-accent)] rounded-full mb-4">
                        <svg className="w-8 h-8 text-[var(--primary-navy)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <p className="text-[var(--gold-accent)] text-sm font-medium mb-1">Certificate of Completion</p>
                      <h3 className="text-xl font-bold text-white mb-2">{cert.courseName}</h3>
                      <p className="text-white/70 text-sm">Instructor: {cert.instructor}</p>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-[var(--gray-500)] mb-1">Credential ID</p>
                        <p className="font-mono text-sm text-[var(--foreground)]">{cert.credentialId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--gray-500)] mb-1">Issued</p>
                        <p className="text-sm text-[var(--foreground)]">
                          {cert.issuedAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 bg-[var(--gray-50)] rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-[var(--primary-navy)]">{cert.grade}</p>
                        <p className="text-xs text-[var(--gray-500)]">Grade</p>
                      </div>
                      <div className="flex-1 bg-[var(--gray-50)] rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{cert.score}%</p>
                        <p className="text-xs text-[var(--gray-500)]">Score</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-[var(--gray-500)] mb-2">Skills Earned</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="primary" size="sm" className="flex-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Certificates */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Upcoming Certificates</h2>
          <div className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
            {inProgressCourses.map((course, index) => (
              <div
                key={course.id}
                className={`p-5 flex items-center gap-4 ${index !== inProgressCourses.length - 1 ? 'border-b border-[var(--gray-100)]' : ''}`}
              >
                <div className="w-12 h-12 bg-[var(--gray-100)] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[var(--foreground)]">{course.title}</h4>
                  <p className="text-sm text-[var(--gray-500)]">Est. completion: {course.estimatedCompletion}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[var(--primary-navy)]">{course.progress}%</p>
                  <p className="text-xs text-[var(--gray-500)]">Progress</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LearnerLayout>
  );
}
