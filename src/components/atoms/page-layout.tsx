import React from 'react';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className='mx-auto max-w-screen-lg sm:p-2'>{children}</div>;
};
