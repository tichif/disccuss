'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Button,
  Textarea,
} from '@nextui-org/react';
import { useFormState } from 'react-dom';

import * as actions from '@/actions';
import FormButton from '../common/form-button';

const TopicCreateForm = () => {
  const [formState, action] = useFormState(actions.createTopic, { errors: {} });

  return (
    <Popover placement='left'>
      <PopoverTrigger>
        <Button color='primary'>Create a Topic</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div className='flex flex-col gap-4 p-3 w-80'>
            <h3 className='text-lg'>Create a topic</h3>
            <Input
              name='name'
              label='Name'
              labelPlacement='outside'
              placeholder='Name'
              isInvalid={!!formState.errors.name}
              errorMessage={formState.errors.name?.join(', ')}
            />
            <Textarea
              name='description'
              label='Description'
              labelPlacement='outside'
              placeholder='Describe your topic'
              isInvalid={!!formState.errors.description}
              errorMessage={formState.errors.description?.join(', ')}
            />
            {formState.errors._form && (
              <div className='p-2 bg-red-200 bordered border-red-400 rounded'>
                {formState.errors._form?.join(', ')}
              </div>
            )}
            <FormButton>Submit</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default TopicCreateForm;
