import Link from "next/link";
import Nav from "./nav";

export default function SiteHeader(props: React.ComponentProps<"header">) {
  return (
    <header {...props}>
      <h1>
        <Link href="/">{process.env.SITE_NAME}</Link>
      </h1>
      <Nav />
    </header>
  );
}
