'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/react';

const FormButton = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' isLoading={pending}>
      {children}
    </Button>
  );
};

export default FormButton;
