import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import SiteMain from "@/components/site-main";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        <SiteMain>{children}</SiteMain>
        <SiteFooter />
      </body>
    </html>
  );
}
