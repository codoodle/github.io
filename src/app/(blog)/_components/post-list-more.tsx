"use client";

import { PostSimple } from "@/types";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { create } from "zustand";
import PostListItem from "./post-list-item";
import PostListMoreButton from "./post-list-more-button";

const root = Symbol("root");

export default function PostListMore() {
  const { slug: slugArray } = useParams<{ slug: string[] }>();
  const { key, pageNextSlug: initialPageNextSlug } = useMemo(() => {
    const isPagination =
      slugArray &&
      slugArray.at(-2) === "page" &&
      /^\d+$/.test(slugArray.at(-1) ?? "");
    const slugWithoutPagination = isPagination
      ? slugArray.slice(0, -2).join("/")
      : slugArray?.join("/");
    const page = isPagination ? Number(slugArray.at(-1)) || 1 : 1;
    const pageNext = page + 1;
    const pageNextSlug = [
      ...(slugWithoutPagination
        ? slugWithoutPagination.split("/").filter((f) => !!f)
        : []),
      "page",
      `${pageNext}`,
    ].join("/");

    return {
      key: slugWithoutPagination ? Symbol.for(slugWithoutPagination) : root,
      pageNextSlug,
    };
  }, [slugArray]);

  const store = useListMoreStore();

  const { pageItems, pageNextSlug, onLoadMore } = useMemo(() => {
    const more = store.more[key];
    return {
      pageItems: more ? more.pageItems : [],
      pageNextSlug: more ? more.pageNextSlug : initialPageNextSlug,
      onLoadMore: (items: PostSimple[], pageNextSlug?: string) =>
        store.onLoadMore(key, items, pageNextSlug),
    };
  }, [store, key, initialPageNextSlug]);

  return (
    <>
      {pageItems.map((post) => (
        <PostListItem key={post.slug} post={post} />
      ))}
      {!!pageNextSlug && (
        <PostListMoreButton moreSlug={pageNextSlug} onLoadMore={onLoadMore} />
      )}
    </>
  );
}

type ListMoreState = {
  more: Record<
    symbol,
    {
      pageItems: PostSimple[];
      pageNextSlug?: string;
      scrollTop?: number;
    }
  >;
};

type ListMoreActions = {
  onLoadMore: (
    key: symbol,
    pageItems: PostSimple[],
    pageNextSlug?: string,
  ) => void;
};

const useListMoreStore = create<ListMoreState & ListMoreActions>((set) => ({
  more: {},
  onLoadMore: (key, pageItems, pageNextSlug) => {
    set((state) => ({
      more: {
        ...state.more,
        [key]: {
          ...state.more[key],
          pageItems: [...(state.more[key]?.pageItems || []), ...pageItems],
          pageNextSlug,
        },
      },
    }));
  },
}));
