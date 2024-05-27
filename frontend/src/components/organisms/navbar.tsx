import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppSelector } from '@/hooks/redux-hooks';
import { selectSession } from '@/features/auth/authSlice';
import { useLogoutMutation, useSessionQuery } from '@/features/apiActions';

import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { PageLayout } from '@/components/atoms/page-layout';
import { Button } from '@/components/atoms/button';

export const Navbar = () => {
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();
  const session = useAppSelector(selectSession);

  // Poll every 5 minutes to check if the user is logged in
  const { error } = useSessionQuery('userSession', {
    pollingInterval: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (error) {
      navigate('/login');
    }
  }, [error, navigate]);

  const handleLogout = () => {
    logout(null);
    navigate('/login');
  };

  return (
    <nav className='h-14 w-full border-b border-neutral-300'>
      <PageLayout className='flex items-center justify-between'>
        <h1 className='text-lg'>Postinaine</h1>
        <Button onClick={handleLogout} className='w-20'>
          {isLoading ? <LoadingSpinner /> : session.userId ? 'Logout' : 'Login'}
        </Button>
      </PageLayout>
    </nav>
  );
};
