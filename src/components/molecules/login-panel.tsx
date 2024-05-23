import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { LoadingSpinner } from '../atoms/loading-spinner';

const formSchema = z.object({
  email: z.string().email(),
  api_token: z.string().min(8),
});

export const LoginPanel = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      api_token: '',
    },
  });

  const mutation = useMutation({
    mutationKey: 'login',
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return axios.get('https://newsapi.org/v2/top-headlines/sources', {
        headers: {
          'X-Api-Key': values.api_token,
        },
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // ae92a97fb02040a598415c15d13a0cb1
    // karl-thomas@zink.ee
    console.log(values);
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='form-control min-h-[400px] w-full max-w-[600px] space-y-5 border border-border sm:rounded-xl'
      >
        <h1 className='p-3 text-center text-xl'>Welcome to News site</h1>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email' {...field} />
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
                <Input placeholder='api token' {...field} />
              </FormControl>
              <FormDescription>This is the token you used to sign up</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          {mutation.isLoading ? <LoadingSpinner /> : 'Login'}
        </Button>
      </form>
    </Form>
  );
};
