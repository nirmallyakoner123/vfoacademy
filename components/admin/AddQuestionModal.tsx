import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Question, AnswerOption } from '@/types/course';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [marks, setMarks] = useState(10);
  const [duration, setDuration] = useState(5);
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [description, setDescription] = useState('');
  
  const [options, setOptions] = useState<AnswerOption[]>([
    { id: 'opt_1', text: '', isCorrect: false },
    { id: 'opt_2', text: '', isCorrect: false },
    { id: 'opt_3', text: '', isCorrect: false },
    { id: 'opt_4', text: '', isCorrect: false },
  ]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: 'opt_' + Date.now(), text: '', isCorrect: false },
    ]);
  };

  const handleDeleteOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, text } : opt))
    );
  };

  const handleCorrectChange = (id: string) => {
    setOptions(
      options.map((opt) => ({ ...opt, isCorrect: opt.id === id }))
    );
  };

  const handleSave = () => {
    const question: Question = {
      id: 'ques_' + Date.now(),
      title,
      type: 'multiple-choice',
      difficulty,
      marks,
      duration,
      category,
      topic,
      subtopic,
      description,
      options,
    };
    onSave(question);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDifficulty('Medium');
    setMarks(10);
    setDuration(5);
    setCategory('');
    setTopic('');
    setSubtopic('');
    setDescription('');
    setOptions([
      { id: 'opt_1', text: '', isCorrect: false },
      { id: 'opt_2', text: '', isCorrect: false },
      { id: 'opt_3', text: '', isCorrect: false },
      { id: 'opt_4', text: '', isCorrect: false },
    ]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Multiple Choice Question" size="xl">
      <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto p-1">
        
        {/* Header Actions */}
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" className="gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate with AI
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-[var(--foreground)] border-b pb-2">Basic Information</h3>
            
            <Input
              label="Title"
              placeholder="Enter question title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Difficulty"
                options={[
                  { label: 'Easy', value: 'Easy' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'Hard', value: 'Hard' },
                ]}
                value={difficulty}
                onChange={(val) => setDifficulty(val as any)}
                required
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={duration.toString()}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              />
            </div>

            <Input
              label="Marks"
              type="number"
              value={marks.toString()}
              onChange={(e) => setMarks(parseInt(e.target.value) || 0)}
            />

            <Select
              label="Category"
              placeholder="Select category..."
              options={[
                { label: 'Programming', value: 'Programming' },
                { label: 'Design', value: 'Design' },
                { label: 'Marketing', value: 'Marketing' },
              ]}
              value={category}
              onChange={setCategory}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Topic"
                placeholder="Select topic..."
                options={[
                  { label: 'React', value: 'React' },
                  { label: 'JavaScript', value: 'JavaScript' },
                ]}
                value={topic}
                onChange={setTopic}
                required
              />
              <Select
                label="Subtopic"
                placeholder="Select subtopic..."
                options={[
                  { label: 'Hooks', value: 'Hooks' },
                  { label: 'Components', value: 'Components' },
                ]}
                value={subtopic}
                onChange={setSubtopic}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--gray-700)]">Question Description <span className="text-[var(--error)]">*</span></label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-[var(--gray-300)] focus:ring-2 focus:ring-[var(--primary-navy)] focus:border-transparent min-h-[100px]"
                placeholder="Enter the detailed question text..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column: Answer Options */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg text-[var(--foreground)]">Answer Options <span className="text-[var(--error)]">*</span></h3>
              <Button variant="ghost" size="sm" onClick={handleAddOption} className="text-[var(--primary-navy)]">
                + Add Option
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {options.map((option, index) => (
                <div key={option.id} className="p-4 rounded-lg bg-[var(--gray-50)] border border-[var(--gray-200)] relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-[var(--gray-700)]">Option {index + 1}</span>
                    {options.length > 2 && (
                      <button onClick={() => handleDeleteOption(option.id)} className="text-[var(--gray-400)] hover:text-[var(--error)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${option.isCorrect ? 'bg-[var(--success)] border-[var(--success)] text-white' : 'border-[var(--gray-400)] bg-white'}`}
                      onClick={() => handleCorrectChange(option.id)}
                    >
                      {option.isCorrect && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm text-[var(--gray-600)] cursor-pointer select-none" onClick={() => handleCorrectChange(option.id)}>Mark as correct</span>
                  </div>

                  <textarea
                    className="w-full px-3 py-2 rounded border border-[var(--gray-300)] focus:ring-1 focus:ring-[var(--primary-navy)] focus:border-transparent text-sm min-h-[60px]"
                    placeholder={`Enter option ${index + 1}...`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--gray-200)]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Create Question</Button>
        </div>
      </div>
    </Modal>
  );
};
