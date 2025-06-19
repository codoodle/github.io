import { readFile } from "node:fs/promises";
import { basename, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { evaluate } from "@mdx-js/mdx";
import { compareDesc } from "date-fns";
import { globby } from "globby";
import matter from "gray-matter";
import { MDXContent } from "mdx/types";
import * as runtime from "react/jsx-runtime";

export type Blog = {
  name: string;
  description: string;
  categories: Category[];
  posts: Post[];
  tags: Tag[];
  ContentComponent?: MDXContent;
};

export type Category = {
  name: string;
  description: string;
  slug: string;
  categories?: Category[];
  posts?: Post[];
  ContentComponent?: MDXContent;
};

export type Tag = {
  name: string;
  slug: string;
  posts: Post[];
};

export type Post = {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  slug: string;
  tags?: Pick<Tag, "name" | "slug">[];
  categories?: Category[];
  categorySlug?: string;
  ContentComponent?: MDXContent;
};

export type PostSimple = {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  slug: string;
  categories?: {
    name: string;
    description: string;
    slug: string;
  }[];
};

type BlogContent = {
  path: string;
  relativePath: string;
  type: "blog";
  blog: Omit<Blog, "categories" | "posts" | "tags">;
};

type CategoryContent = {
  path: string;
  relativePath: string;
  type: "category";
  category: Category;
};

type PostContent = {
  path: string;
  relativePath: string;
  type: "post";
  post: Post;
};

type Content = BlogContent | CategoryContent | PostContent;

function isBlogContent(content: Content): content is BlogContent {
  return content.type === "blog";
}

function isCategoryContent(content: Content): content is CategoryContent {
  return content.type === "category";
}

function isPostContent(content: Content): content is PostContent {
  return content.type === "post";
}

function isIndex(basename: string) {
  return basename === "index";
}

async function loadContents() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const paths = await globby(["**/*.md", "**/*.mdx"], {
    cwd: __dirname,
    absolute: true,
  });

  const contents = await Promise.all(
    paths.map(async (path): Promise<Content> => {
      const contentFileRelativePath = relative(__dirname, path);
      const contentFileBasename = basename(
        contentFileRelativePath,
        extname(contentFileRelativePath),
      );
      const contentRaw = await readFile(path, "utf-8");
      const { data: meta, content } = matter(contentRaw);
      if (isIndex(contentFileBasename)) {
        if (dirname(contentFileRelativePath) === ".") {
          return {
            path: path,
            relativePath: contentFileRelativePath,
            type: "blog",
            blog: {
              name: meta.name,
              description: meta.description,
              ContentComponent: (await evaluate(content, runtime)).default,
            },
          };
        }
        return {
          path: path,
          relativePath: contentFileRelativePath,
          type: "category",
          category: {
            name: meta.name,
            description: meta.description,
            slug: trimSlugSuffix(contentFileRelativePath, 1),
            ContentComponent: (await evaluate(content, runtime)).default,
          },
        };
      } else {
        return {
          path: path,
          relativePath: contentFileRelativePath,
          type: "post",
          post: {
            title: meta.title,
            description: meta.description,
            datePublished: meta.datePublished,
            dateModified: meta.dateModified,
            author: meta.author,
            tags: meta.tags,
            slug: concatSlug([
              trimSlugSuffix(contentFileRelativePath, 1),
              contentFileBasename,
            ]),
            categorySlug:
              trimSlugSuffix(contentFileRelativePath, 1) || undefined,
            ContentComponent: (
              await evaluate(content, {
                ...runtime,
              })
            ).default,
          },
        };
      }
    }),
  );

  let blog: BlogContent["blog"] = undefined!;
  const categories: Category[] = [];
  const posts: Post[] = [];
  const tagMap = new Map<string, Tag>();
  for (const content of contents) {
    if (isBlogContent(content)) {
      blog = content.blog;
    } else if (isCategoryContent(content)) {
      categories.push(content.category);
    } else if (isPostContent(content)) {
      posts.push(content.post);
      if (content.post.tags) {
        for (const tag of content.post.tags) {
          if (tagMap.has(tag.slug)) {
            tagMap.get(tag.slug)!.posts.push(content.post);
          } else {
            tagMap.set(tag.slug, { ...tag, posts: [content.post] });
          }
        }
      }
    }
  }

  posts.sort((a, b) => compareDesc(a.datePublished, b.datePublished));
  for (const post of posts) {
    if (post.categorySlug) {
      post.categories = getCategories(post.categorySlug);
    }
  }

  for (const category of categories) {
    category.categories = getCategories(trimSlugSuffix(category.slug, 1));
    category.posts = posts
      .filter(
        ({ categorySlug }) =>
          categorySlug === category.slug ||
          categorySlug?.startsWith(`${category.slug}/`),
      )
      .sort((a, b) => compareDesc(a.datePublished, b.datePublished));
  }

  const tags = Array.from(tagMap.values());
  for (const tag of tags) {
    tag.posts.sort((a, b) => compareDesc(a.datePublished, b.datePublished));
  }

  function getCategories(slug: string | string[]) {
    const ancestors: Category[] = [];
    const slugArray = Array.isArray(slug)
      ? [...slug.filter((f) => !!f)]
      : toSlugArray(slug);
    while (slugArray.length > 0) {
      const parentSlug = concatSlug(slugArray);
      const parent = categories.find((f) => f.slug === parentSlug);
      if (parent) {
        ancestors.unshift(parent);
      }
      slugArray.pop();
    }
    if (ancestors.length > 0) {
      return ancestors;
    }
  }

  return {
    ...blog,
    categories,
    posts,
    tags,
  };
}

export const blog: Blog = await loadContents();

export function trimSlugSuffix(slug: string | string[], count: number): string {
  if (count <= 0) {
    return Array.isArray(slug) ? slug.join("/") : slug;
  }
  return (Array.isArray(slug) ? slug.filter((f) => !!f) : toSlugArray(slug))
    .slice(0, -count)
    .join("/");
}

export function concatSlug(slug: string | string[], ...add: string[]) {
  return [...(Array.isArray(slug) ? slug : toSlugArray(slug)), ...add]
    .filter((f) => !!f)
    .join("/");
}

export function toSlugArray(slug: string) {
  return slug.split("/").filter((f) => !!f);
}

export function resolveContentBySlug(slug?: string | string[]) {
  if (slug && slug.length > 0) {
    const s = Array.isArray(slug) ? concatSlug(slug) : slug;
    const isTags = s.startsWith("tags/");
    if (isTags) {
      const tag = blog.tags.find((f) => `tags/${f.slug}` === s);
      if (tag) {
        return {
          tag,
        };
      }
    }
    const category = blog.categories.find((f) => f.slug === s);
    if (category) {
      return {
        category,
      };
    }
    const post = blog.posts.find((f) => f.slug === s);
    if (post) {
      return {
        post,
      };
    }
  }
  return {
    blog,
  };
}
