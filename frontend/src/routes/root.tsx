import { PageLayout } from '@/components/atoms/page-layout';
import { Footer } from '@/components/organisms/footer';
import { Navbar } from '@/components/organisms/navbar';
import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <PageLayout className='min-h-[calc(100vh-56px)]'>
        <Outlet />
      </PageLayout>
      <Footer />
    </QueryClientProvider>
  );
}
