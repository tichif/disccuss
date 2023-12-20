'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/auth';
import type { Topic } from '@prisma/client';
import { redirect } from 'next/navigation';

import { prisma } from '@/db';
import paths from '@/path';

const createTopicSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3)
    .regex(/[a-z-]/, {
      message: 'Must be lowercase letters or dashes without spaces',
    }),
  description: z.string({ required_error: 'Description is required' }).min(10),
});

interface CreateTopicState {
  errors: {
    [key: string]: string[];
  };
}

export async function createTopic(
  formState: CreateTopicState,
  formData: FormData
): Promise<CreateTopicState> {
  const result = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();

  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in.'],
      },
    };
  }

  let topic: Topic;

  try {
    topic = await prisma.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (error: any) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    }
    return {
      errors: {
        _form: ['Something went wrong.'],
      },
    };
  }

  // TODO: revalidate the homepage
  revalidatePath('/');

  redirect(paths.topicShow(topic.slug));
}
