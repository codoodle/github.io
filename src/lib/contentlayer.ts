import {
  allCategories,
  allPosts,
  Category as CategoryOfContentlayer,
  hero,
  Post as PostOfContentlayer,
} from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { generateSlug, toSlugArray } from "./slug";

export type Post = PostOfContentlayer & {
  categories: Category[];
};

export type Category = CategoryOfContentlayer & {
  posts: Post[];
};

const posts: Post[] = allPosts
  .map((post) => ({
    ...post,
    categories: [],
  }))
  .sort((a, b) => compareDesc(a.datePublished, b.datePublished));

const categories: Category[] = allCategories.map((category) => ({
  ...category,
  posts: [],
}));

for (const post of posts) {
  post.categories.push(
    ...categories.filter(
      (category) =>
        post.categorySlug === category.slug || post.categorySlug.startsWith(`${category.slug}/`),
    ),
  );
}

for (const category of categories) {
  category.posts.push(
    ...posts.filter(
      (post) =>
        post.categorySlug === category.slug || post.categorySlug.startsWith(`${category.slug}/`),
    ),
  );
}

function getParentCategories(slug: string) {
  const currentCategories: Category[] = [];
  const slugArray = toSlugArray(slug);

  while (slugArray.length > 0) {
    const parentSlug = generateSlug(slugArray);
    const parent = categories.find((f) => f.slug === parentSlug);
    if (parent) {
      currentCategories.unshift(parent);
    }
    slugArray.pop();
  }

  return currentCategories;
}

function contentFromSlug(slug?: string) {
  let currentPost: Post | undefined = undefined;

  if (slug) {
    const category = categories.find((f) => f.slug === slug);
    if (category) {
      return {
        categories: getParentCategories(category.slug),
        category,
        post: undefined,
      };
    }

    currentPost = posts.find((f) => f.slug === slug);
    if (currentPost) {
      return {
        categories: getParentCategories(currentPost.categorySlug),
        category: categories.find((c) => c.slug === currentPost?.categorySlug),
        post: currentPost,
      };
    }
  }

  return {
    categories: [],
    category: undefined,
    post: undefined,
  };
}

export { categories, contentFromSlug, hero, posts };
