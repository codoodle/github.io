"use client";

import { PostSimple } from "@/contents";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type ListMoreButtonProps = {
  moreSlug: string;
  onLoadMore?: (pageItems: PostSimple[], pageNextSlug?: string) => void;
};

export default function PostListMoreButton({
  moreSlug,
  onLoadMore,
}: ListMoreButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(
    async (force = false) => {
      if ((isLoading || hasError) && !force) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/pagination/${moreSlug}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const { pageItems, pageNextSlug } = (await response.json()) as {
          pageItems: PostSimple[];
          pageNext: number | undefined;
          pageNextSlug: string | undefined;
        };
        onLoadMore?.(pageItems, pageNextSlug);

        if (observerRef.current) {
          if (pageNextSlug) {
            if (loaderRef.current) {
              observerRef.current.unobserve(loaderRef.current);
              observerRef.current.observe(loaderRef.current);
            }
          } else {
            observerRef.current.disconnect();
            observerRef.current = null;
            loaderRef.current = null;
          }
        }
        setHasError(false);
      } catch (error) {
        console.error("loadMore failed:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasError, moreSlug, onLoadMore],
  );

  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    if (!loaderRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "200px" },
    );
    observerRef.current = observer;
    observer.observe(loaderRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <li>
      <Link
        href={`/${moreSlug}`}
        rel="next"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        Next page
      </Link>
      <div ref={loaderRef} style={{ height: 1 }} aria-hidden />
      {isLoading && <span aria-live="polite">Loading more...</span>}
      {hasError && (
        <button
          type="button"
          onClick={() => {
            setHasError(false);
            loadMoreRef.current(true);
          }}
          className="mt-2 text-sm text-red-600 underline underline-offset-4"
        >
          Retry loading
        </button>
      )}
    </li>
  );
}
