import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  headerActions?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  onToggle,
  headerActions,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };
  
  return (
    <div className="border border-[var(--gray-200)] rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-5 flex items-center justify-between bg-[var(--gray-50)] hover:bg-[var(--gray-100)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 text-[var(--gray-600)] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-[var(--foreground)]">{title}</span>
        </div>
        {headerActions && (
          <div onClick={(e) => e.stopPropagation()}>
            {headerActions}
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 py-5 border-t border-[var(--gray-200)]">
          {children}
        </div>
      )}
    </div>
  );
};
