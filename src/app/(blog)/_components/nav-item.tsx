"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({
  style,
  ...props
}: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      style={
        pathname.startsWith(
          typeof props.href === "string"
            ? props.href
            : (props.href.pathname ?? ""),
        )
          ? { ...style, fontWeight: 600 }
          : style
      }
    />
  );
}
