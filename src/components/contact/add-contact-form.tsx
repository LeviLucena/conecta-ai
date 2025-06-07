
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import type { User } from '@/lib/types';
import { addMockUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const addContactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  ddi: z.string().regex(/^\+?[1-9]\d{0,2}$/, { message: 'Invalid DDI (e.g., +1, +55).' }).optional().or(z.literal('')),
  ddd: z.string().regex(/^\d{2,3}$/, { message: 'Invalid DDD (e.g., 11, 048).' }).optional().or(z.literal('')),
  phone: z.string().regex(/^\d{7,9}$/, { message: 'Invalid phone number (7-9 digits).' }).optional().or(z.literal('')),
});

type AddContactFormValues = z.infer<typeof addContactSchema>;

interface AddContactFormProps {
  onFormSubmit: () => void;
}

export function AddContactForm({ onFormSubmit }: AddContactFormProps) {
  const { toast } = useToast();
  const form = useForm<AddContactFormValues>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      name: '',
      email: '',
      ddi: '',
      ddd: '',
      phone: '',
    },
  });

  async function onSubmit(values: AddContactFormValues) {
    try {
      const newUserInput: Omit<User, 'id' | 'avatarUrl' | 'status'> = {
        name: values.name,
        email: values.email || undefined,
        ddi: values.ddi || undefined,
        ddd: values.ddd || undefined,
        phone: values.phone || undefined,
      };
      addMockUser(newUserInput);
      toast({
        title: 'Contact Added',
        description: `${values.name} has been successfully added to your contacts.`,
      });
      form.reset();
      onFormSubmit(); // Close the dialog
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add contact. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new contact.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ddi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DDI</FormLabel>
                  <FormControl>
                    <Input placeholder="+55" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ddd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DDD</FormLabel>
                  <FormControl>
                    <Input placeholder="11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormDescription>
            DDI is the country code (e.g., +1 for USA, +55 for Brazil). DDD is the area code.
          </FormDescription>
           <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Adding...' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
