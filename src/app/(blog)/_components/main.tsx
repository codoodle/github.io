export default function Main({
  children,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main {...props}>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {children}
      </div>
    </main>
  );
}
