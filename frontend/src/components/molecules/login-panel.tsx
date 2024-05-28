import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { useLoginMutation, LoginFetchError } from '@/features/apiActions';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';

const formSchema = z.object({
  email: z.string().email(),
  api_token: z.string().min(32, { message: 'API token must be at least 32 characters' }),
});

export const LoginPanel = () => {
  const [login, loginInfo] = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      api_token: '',
    },
  });

  const navigateToHome = () => {
    navigate('/');
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login(values)
      .unwrap()
      .then(() => navigateToHome())
      .catch((error: LoginFetchError) => {
        if (error.status === 401) {
          form.setError('api_token', { message: error.data.detail });
        } else {
          form.setError('api_token', { message: 'An itnernal error occurred, please try again later!' });
        }
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='form-control h-max w-full max-w-[600px] space-y-5 border border-border border-neutral-300 bg-white p-5 sm:rounded-xl'
        data-testid='login-form'
      >
        <h1 className='text-center text-xl' data-testid='login-form-header'>
          Login to Postinaine
        </h1>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input aria-label='email' placeholder='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='api_token'
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Token</FormLabel>
              <FormControl>
                <Input aria-label='api-token' placeholder='api token' {...field} />
              </FormControl>
              <FormDescription>
                Get your API token from{' '}
                <a target='_blank' className='text-primary underline' href='https://newsapi.org/account'>
                  here
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={Object.values(form.formState.dirtyFields).length !== 2}>
          {loginInfo.isLoading ? <LoadingSpinner /> : 'Login'}
        </Button>
      </form>
    </Form>
  );
};
