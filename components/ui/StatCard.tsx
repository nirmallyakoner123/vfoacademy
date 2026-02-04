'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      iconBg: 'bg-[var(--gray-100)]',
      iconColor: 'text-[var(--gray-600)]',
    },
    primary: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    success: {
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    warning: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    error: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--gray-500)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--foreground)] mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-[var(--gray-500)]">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <svg
                className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-[var(--gray-500)] font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <div className={styles.iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
};
