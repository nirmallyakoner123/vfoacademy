'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
}

export const AddWeekModal: React.FC<AddWeekModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title, description);
      setTitle('');
      setDescription('');
      onClose();
    }
  };
  
  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Week"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!title.trim()}>
            Add Week
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Week Title"
          placeholder="e.g., Week 1: Introduction to Film Production"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            Week Description (Optional)
          </label>
          <textarea
            placeholder="Brief description of what this week covers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--gray-300)] focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 placeholder:text-[var(--gray-400)] transition-all duration-200"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};
