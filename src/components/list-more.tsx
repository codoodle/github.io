"use client";

import { Post } from "@/lib/contentlayer";
import Link from "next/link";
import { MouseEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ListItem from "./list-item";

type PostListMoreProps = {
  nextSlug: string;
};
export default function ListMore(props: PostListMoreProps) {
  const [pageItems, setPageItems] = useState<Post[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [nextSlug, setNextSlug] = useState(props.nextSlug);
  const [isLoading, setIsLoading] = useState(false);

  const elRef = useRef<HTMLDivElement>(null);

  const handleMore = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch(`/api/pagination/${nextSlug}`, { method: "GET" });
    if (response.ok) {
      const { items: moreItems, nextSlug } = await response.json();
      setPageItems([...pageItems, ...moreItems]);
      setHasNext(!!nextSlug);
      setNextSlug(nextSlug);
    }
    setIsLoading(false);
  };

  return (
    <div ref={elRef}>
      {elRef.current &&
        createPortal(
          pageItems.map((m) => <ListItem key={m._id} item={m} />),
          elRef.current.closest("section")!.querySelector("ul")!,
        )}
      {hasNext && (
        <Link rel="next" href={`/${nextSlug}`} onClick={handleMore}>
          {isLoading ? "Loading.." : "Get more posts"}
        </Link>
      )}
    </div>
  );
}
