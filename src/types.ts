import { MDXContent } from "mdx/types";

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
