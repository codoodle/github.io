import Footer from "./_components/footer";
import Header from "./_components/header";
import Main from "./_components/main";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header className="w-full max-w-[1200px] mx-auto px-8 h-14" />
      <Main className="w-full max-w-[1200px] mx-auto px-8 py-6 min-h-[calc(100svh-calc(var(--spacing)*14))]">
        {children}
      </Main>
      <Footer className="w-full max-w-[1200px] mx-auto px-8 py-4" />
    </div>
  );
}
