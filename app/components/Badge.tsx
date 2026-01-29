import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'default' | 'success-subtle' | 'warning-subtle' | 'info-subtle';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-[#1cb427] text-white',
    warning: 'bg-[#ffa446] text-white',
    info: 'bg-[#0077d2] text-white',
    'success-subtle': 'bg-green-50 text-[#1cb427] border border-green-100',
    'warning-subtle': 'bg-orange-50 text-[#ffa446] border border-orange-100',
    'info-subtle': 'bg-blue-50 text-[#0077d2] border border-blue-100',
    default: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
