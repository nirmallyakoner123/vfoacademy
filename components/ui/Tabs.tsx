'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="border-b border-[var(--gray-200)]">
      <nav className="flex gap-1" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-3.5 text-sm font-medium rounded-t-lg transition-all
              ${activeTab === tab.id
                ? 'bg-white text-[var(--primary-navy)] border border-[var(--gray-200)] border-b-white -mb-px'
                : 'text-[var(--gray-600)] hover:text-[var(--primary-navy)] hover:bg-[var(--gray-50)]'
              }
            `}
          >
            {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  px-2 py-0.5 text-xs rounded-full font-semibold
                  ${activeTab === tab.id
                    ? 'bg-[var(--primary-navy)] text-white'
                    : 'bg-[var(--gray-200)] text-[var(--gray-600)]'
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
