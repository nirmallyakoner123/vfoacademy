'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateEmail } from '@/lib/validation';

interface NewUser {
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  lastActive: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: NewUser) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Learner' // Default to Learner (Employee)
  });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // Validate
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      onAdd({
        ...formData,
        status: 'Active',
        joinedDate: new Date().toLocaleDateString(),
        lastActive: 'Just now'
      });
      setIsLoading(false);
      onClose();
      setFormData({ name: '', email: '', role: 'Learner' }); // Reset
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>Add User</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">Role</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, role: 'Learner' })}
              className={`
                p-3 rounded-lg border text-sm font-medium transition-all
                ${formData.role === 'Learner'
                  ? 'border-[var(--primary-navy)] bg-blue-50 text-[var(--primary-navy)] ring-1 ring-[var(--primary-navy)]'
                  : 'border-[var(--gray-200)] text-[var(--gray-600)] hover:border-[var(--gray-300)]'
                }
              `}
            >
              Employee (Learner)
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: 'Admin' })}
              className={`
                p-3 rounded-lg border text-sm font-medium transition-all
                ${formData.role === 'Admin'
                  ? 'border-[var(--primary-navy)] bg-blue-50 text-[var(--primary-navy)] ring-1 ring-[var(--primary-navy)]'
                  : 'border-[var(--gray-200)] text-[var(--gray-600)] hover:border-[var(--gray-300)]'
                }
              `}
            >
              Administrator
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--gray-500)]">
            {formData.role === 'Learner' 
              ? 'Can view courses and take assessments.' 
              : 'Full access to manage courses, users, and platform settings.'}
          </p>
        </div>
      </div>
    </Modal>
  );
};
