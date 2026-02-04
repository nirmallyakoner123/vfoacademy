'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { AssessmentConfig } from '@/types/course';

interface AssessmentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AssessmentConfig) => void;
  initialConfig?: AssessmentConfig;
  weekTitle: string;
}

export const AssessmentConfigModal: React.FC<AssessmentConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  weekTitle,
}) => {
  const [config, setConfig] = useState<Partial<AssessmentConfig>>(
    initialConfig || {
      title: '',
      description: '',
      type: 'quiz',
      timeLimit: 60,
      maxAttempts: 1,
      passingScore: 70,
      shuffleQuestions: false,
      shuffleOptions: false,
      showResults: 'immediately',
      showCorrectAnswers: true,
      proctoring: {
        enabled: false,
        copyPasteAllowed: true,
        rightClickAllowed: true,
        printAllowed: true,
        devToolsAllowed: true,
        tabSwitchLimit: undefined,
      },
      questions: [],
      totalMarks: 0,
      evaluationDuration: 60,
    }
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'security' | 'questions'>('basic');

  const handleSave = () => {
    if (!config.title?.trim()) {
      alert('Please enter a test title');
      return;
    }

    const fullConfig: AssessmentConfig = {
      id: initialConfig?.id || 'assessment_' + Date.now(),
      title: config.title || '',
      description: config.description,
      type: config.type || 'quiz',
      timeLimit: config.timeLimit,
      maxAttempts: config.maxAttempts || 1,
      passingScore: config.passingScore || 70,
      shuffleQuestions: config.shuffleQuestions || false,
      shuffleOptions: config.shuffleOptions || false,
      showResults: config.showResults || 'immediately',
      showCorrectAnswers: config.showCorrectAnswers ?? true,
      proctoring: config.proctoring || {
        enabled: false,
        copyPasteAllowed: true,
        rightClickAllowed: true,
        printAllowed: true,
        devToolsAllowed: true,
      },
      externalTestId: config.externalTestId,
      externalTestUrl: config.externalTestUrl,
      questions: config.questions || [],
      totalMarks: config.totalMarks || 0,
      evaluationDuration: config.evaluationDuration,
      aiVoice: config.aiVoice,
      ogImage: config.ogImage,
    };

    onSave(fullConfig);
    onClose();
  };

  const typeOptions = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' },
    { value: 'practice', label: 'Practice Test' },
  ];

  const showResultsOptions = [
    { value: 'immediately', label: 'Immediately after submission' },
    { value: 'after-submission', label: 'After all submissions' },
    { value: 'after-due-date', label: 'After due date' },
    { value: 'never', label: 'Never (manual review only)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialConfig ? 'Edit Assessment' : 'Create Assessment'}
      size="xl"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {initialConfig ? 'Update Assessment' : 'Create Assessment'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-[var(--gray-200)]">
          {[
            { id: 'basic', label: 'Test Configuration' },
            { id: 'security', label: 'Security & Proctoring' },
            { id: 'questions', label: 'Questions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--primary-navy)] text-[var(--primary-navy)]'
                  : 'border-transparent text-[var(--gray-500)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Basic Configuration Tab */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <Input
                label="Test Title"
                placeholder="Test title..."
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Select
                label="Test Type"
                options={typeOptions}
                value={config.type || 'quiz'}
                onChange={(value) => setConfig({ ...config, type: value as AssessmentConfig['type'] })}
              />
            </div>
            <div>
              <Input
                label="Time Limit (minutes)"
                type="number"
                placeholder="60"
                value={config.timeLimit?.toString() || ''}
                onChange={(e) => setConfig({ ...config, timeLimit: parseInt(e.target.value) || undefined })}
                helperText="Leave empty for no time limit"
              />
            </div>
            <div>
              <Input
                label="Evaluation Duration (min)"
                type="number"
                placeholder="60"
                value={config.evaluationDuration?.toString() || ''}
                onChange={(e) => setConfig({ ...config, evaluationDuration: parseInt(e.target.value) || undefined })}
                helperText="Time for manual evaluation"
              />
            </div>
            <div>
              <Input
                label="Max Attempts"
                type="number"
                placeholder="1"
                value={config.maxAttempts?.toString() || '1'}
                onChange={(e) => setConfig({ ...config, maxAttempts: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Input
                label="Passing Score (%)"
                type="number"
                placeholder="70"
                value={config.passingScore?.toString() || '70'}
                onChange={(e) => setConfig({ ...config, passingScore: parseInt(e.target.value) || 70 })}
              />
            </div>
            <div className="col-span-2">
              <Select
                label="Show Results"
                options={showResultsOptions}
                value={config.showResults || 'immediately'}
                onChange={(value) => setConfig({ ...config, showResults: value as AssessmentConfig['showResults'] })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-2.5">
                Description
              </label>
              <textarea
                placeholder="Test description..."
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[var(--gray-300)] focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 transition-all text-base resize-none"
              />
            </div>
            <div className="col-span-2 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.shuffleQuestions || false}
                  onChange={(e) => setConfig({ ...config, shuffleQuestions: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary-navy)]"
                />
                <span className="text-sm text-[var(--foreground)]">Shuffle Questions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.shuffleOptions || false}
                  onChange={(e) => setConfig({ ...config, shuffleOptions: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary-navy)]"
                />
                <span className="text-sm text-[var(--foreground)]">Shuffle Answer Options</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCorrectAnswers ?? true}
                  onChange={(e) => setConfig({ ...config, showCorrectAnswers: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary-navy)]"
                />
                <span className="text-sm text-[var(--foreground)]">Show Correct Answers</span>
              </label>
            </div>
          </div>
        )}

        {/* Security & Proctoring Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-[var(--gray-50)] rounded-xl p-6">
              <h4 className="font-semibold text-[var(--foreground)] mb-4">Proctoring Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'copyPasteAllowed', label: 'Copy & Paste', description: 'Ctrl+C/V operations' },
                  { key: 'rightClickAllowed', label: 'Right Click Menu', description: 'Context menu access' },
                  { key: 'printAllowed', label: 'Print Access', description: 'Ctrl+P printing' },
                  { key: 'devToolsAllowed', label: 'Developer Tools', description: 'F12 inspect tools' },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-[var(--gray-200)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${config.proctoring?.[setting.key as keyof typeof config.proctoring] ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-sm text-[var(--foreground)]">{setting.label}</p>
                        <p className="text-xs text-[var(--gray-500)]">{setting.description}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.proctoring?.[setting.key as keyof typeof config.proctoring] as boolean ?? true}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          proctoring: {
                            ...config.proctoring!,
                            [setting.key]: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 rounded border-[var(--gray-300)] text-[var(--primary-navy)]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-white rounded-xl border border-[var(--gray-200)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${config.proctoring?.tabSwitchLimit !== undefined ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="font-medium text-sm text-[var(--foreground)]">Tab Switching</p>
                      <p className="text-xs text-[var(--gray-500)]">Alt+Tab navigation</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tabSwitch"
                      checked={config.proctoring?.tabSwitchLimit === undefined}
                      onChange={() =>
                        setConfig({
                          ...config,
                          proctoring: { ...config.proctoring!, tabSwitchLimit: undefined },
                        })
                      }
                      className="w-4 h-4 text-[var(--primary-navy)]"
                    />
                    <span className="text-sm text-[var(--foreground)]">Unlimited tab switches</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tabSwitch"
                      checked={config.proctoring?.tabSwitchLimit !== undefined}
                      onChange={() =>
                        setConfig({
                          ...config,
                          proctoring: { ...config.proctoring!, tabSwitchLimit: 3 },
                        })
                      }
                      className="w-4 h-4 text-[var(--primary-navy)]"
                    />
                    <span className="text-sm text-[var(--foreground)]">Limit to</span>
                    <input
                      type="number"
                      value={config.proctoring?.tabSwitchLimit || 3}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          proctoring: { ...config.proctoring!, tabSwitchLimit: parseInt(e.target.value) || 3 },
                        })
                      }
                      disabled={config.proctoring?.tabSwitchLimit === undefined}
                      className="w-16 px-2 py-1 rounded border border-[var(--gray-300)] text-sm disabled:opacity-50"
                    />
                    <span className="text-sm text-[var(--foreground)]">switches</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-[var(--gray-600)]">Security Level:</span>
                <span className={`text-sm font-medium ${
                  !config.proctoring?.copyPasteAllowed && !config.proctoring?.rightClickAllowed
                    ? 'text-red-600'
                    : config.proctoring?.tabSwitchLimit !== undefined
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}>
                  {!config.proctoring?.copyPasteAllowed && !config.proctoring?.rightClickAllowed
                    ? '● Strict'
                    : config.proctoring?.tabSwitchLimit !== undefined
                    ? '● Moderate'
                    : '● Flexible'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Questions', value: config.questions?.length || 0, icon: '✓' },
                { label: 'Test Duration', value: `${config.timeLimit || 0}m`, icon: '⏱' },
                { label: 'Marks', value: config.totalMarks || 0, icon: '✓' },
                { label: 'Evaluation', value: `${config.evaluationDuration || 60}m`, icon: '⏱' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--gray-50)] rounded-xl p-4">
                  <p className="text-xs text-[var(--gray-500)] mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-[var(--foreground)]">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* External Test Integration */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">External Test Platform Integration</h4>
                  <p className="text-sm text-[var(--gray-600)] mb-4">
                    Connect to your external question bank or test platform to import questions.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="External Test ID"
                      placeholder="Enter test ID from external platform"
                      value={config.externalTestId || ''}
                      onChange={(e) => setConfig({ ...config, externalTestId: e.target.value })}
                    />
                    <Input
                      label="External Test URL"
                      placeholder="https://..."
                      value={config.externalTestUrl || ''}
                      onChange={(e) => setConfig({ ...config, externalTestUrl: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import Questions from Platform
                  </Button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[var(--foreground)]">Questions</h4>
                <span className="text-sm text-[var(--gray-500)]">
                  {config.questions?.length || 0} questions selected
                </span>
              </div>
              
              {(!config.questions || config.questions.length === 0) ? (
                <div className="bg-[var(--gray-50)] rounded-xl p-8 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[var(--gray-500)] mb-4">No questions added yet</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="primary" size="sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Question
                    </Button>
                    <Button variant="outline" size="sm">
                      Import from Bank
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {config.questions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-[var(--gray-200)] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[var(--gray-300)]" />
                        <div className="flex-1">
                          <p className="font-medium text-[var(--foreground)]">{question.title}</p>
                          <p className="text-sm text-[var(--gray-500)] mt-1">{question.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-[var(--gray-100)] px-2 py-1 rounded">{question.type}</span>
                            <span className="text-xs bg-[var(--gray-100)] px-2 py-1 rounded">{question.difficulty}</span>
                            <span className="text-xs bg-[var(--gray-100)] px-2 py-1 rounded">{question.marks}pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
