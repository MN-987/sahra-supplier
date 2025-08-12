import React from 'react';
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function FormProvider({ children, onSubmit, methods }: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit}>{children}</form>
    </Form>
  );
}
