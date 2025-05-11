"use client";

import { Category } from "@/lib/contentlayer";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({
  category,
  children,
  ...props
}: React.ComponentProps<typeof Link> & {
  category: Category;
}) {
  const pathname = usePathname();
  return (
    <Link
      style={
        pathname.startsWith(`/${category.slug}`)
          ? {
              fontWeight: 600,
            }
          : {}
      }
      {...props}
    >
      {children ?? category.name}
    </Link>
  );
}
