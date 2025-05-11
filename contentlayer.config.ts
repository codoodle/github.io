import { parse } from "node:path";

import { generateSlug } from "@/lib/slug";
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer2/source-files";

export const Hero = defineDocumentType(() => ({
  name: "Hero",
  isSingleton: true,
  filePathPattern: "_.md",
  contentType: "markdown",
}));

export const Category = defineDocumentType(() => ({
  name: "Category",
  filePathPattern: "**/_.md",
  contentType: "markdown",
  fields: {
    name: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve(category) {
        return generateSlug(category._raw.sourceFileDir);
      },
    },
  },
}));

export const Tag = defineNestedType(() => ({
  name: "Tag",
  fields: {
    name: { type: "string", required: true },
    slug: { type: "string", required: true },
  },
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "**/*.md",
  contentType: "markdown",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    datePublished: {
      type: "date",
      required: true,
    },
    dateModified: {
      type: "date",
      required: true,
    },
    tags: {
      type: "list",
      of: Tag,
      required: false,
    },
  },
  computedFields: {
    categorySlug: {
      type: "string",
      resolve(post) {
        return generateSlug(post._raw.sourceFileDir);
      },
    },
    slug: {
      type: "string",
      resolve(post) {
        return generateSlug(post._raw.sourceFileDir, parse(post._raw.sourceFileName).name);
      },
    },
  },
}));

export default makeSource({ contentDirPath: "contents", documentTypes: [Hero, Category, Post] });
