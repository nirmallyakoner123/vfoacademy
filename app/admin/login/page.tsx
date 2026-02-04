'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateEmail, validatePassword } from '@/lib/validation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ email: '', password: '', general: '' });
    
    // Validate
    const newErrors = { email: '', password: '', general: '' };
    
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password is required';
    }
    
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    
    // Mock login
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock authentication - accept any valid email/password
      if (email && password) {
        // Store auth token (mock)
        if (rememberMe) {
          localStorage.setItem('admin_remember', 'true');
        }
        localStorage.setItem('admin_token', 'mock_token_' + Date.now());
        
        // Redirect to course create page
        router.push('/admin/courses/create');
      } else {
        setErrors({ ...errors, general: 'Invalid credentials. Please try again.' });
        setIsLoading(false);
      }
    }, 1000);
  };
  
  const isFormValid = validateEmail(email) && validatePassword(password);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-navy)] via-[var(--primary-navy-dark)] to-[var(--primary-navy)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--gold-accent)] rounded-2xl mb-4 shadow-xl">
            <svg className="w-12 h-12 text-[var(--primary-navy)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Virtual Film Office</h1>
          <p className="text-[var(--gold-accent-light)]">Admin Portal</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">Welcome Back</h2>
          
          {errors.general && (
            <div className="mb-4 p-4 bg-[var(--error-light)] border border-[var(--error)] rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[var(--error)]">Login Failed</p>
                <p className="text-sm text-red-700 mt-1">{errors.general}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-7">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@vfo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              showPasswordToggle
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)]"
                />
                <span className="text-sm text-[var(--gray-700)]">Remember me</span>
              </label>
              
              <button
                type="button"
                className="text-sm text-[var(--primary-navy)] hover:text-[var(--primary-navy-dark)] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isFormValid}
              isLoading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--gray-500)]">
              Need help? Contact{' '}
              <a href="mailto:support@vfo.com" className="text-[var(--primary-navy)] hover:underline font-medium">
                support@vfo.com
              </a>
            </p>
          </div>
        </div>
        
        <p className="text-center text-sm text-[var(--gold-accent-light)] mt-6">
          © 2026 Virtual Film Office. All rights reserved.
        </p>
        
        <p className="text-center text-sm text-gray-400 mt-4">
          Are you a learner?{' '}
          <a href="/login" className="text-[var(--gold-accent)] hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
