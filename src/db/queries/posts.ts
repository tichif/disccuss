import { Post } from '@prisma/client';

import { prisma } from '..';

export type PostWithData = Awaited<
  ReturnType<typeof fetchPostsByTopicSlug | typeof fetchPost>
>[number];
export function fetchPostsByTopicSlug(slug: string) {
  return prisma.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}

export function fetchPost() {
  return prisma.post.findMany({
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}
