import React from 'react';
import clsx from 'clsx';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return <div className={clsx('mx-auto max-w-screen-lg sm:p-2', className)}>{children}</div>;
};
