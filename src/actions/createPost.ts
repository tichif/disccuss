'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Post } from '@prisma/client';

import { auth } from '@/auth';
import { prisma } from '@/db';
import paths from '@/path';

interface CreatePostState {
  errors: {
    [key: string]: string[];
  };
}

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export async function createPost(
  slug: string,
  formState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
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
        _form: ['You must signed in.'],
      },
    };
  }

  const topic = await prisma.topic.findUnique({
    where: {
      slug,
    },
  });

  if (!topic) {
    return {
      errors: {
        _form: ['This topic does not exist.'],
      },
    };
  }

  let post: Post;

  try {
    post = await prisma.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
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
        _form: ['Something went wrong'],
      },
    };
  }

  // TODO: revalidate the topicShowPage
  revalidatePath(paths.topicShow(topic.slug));
  redirect(paths.postShow(topic.slug, post.id));
}
