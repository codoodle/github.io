export default function SiteFooter(props: React.ComponentProps<"footer">) {
  return (
    <footer {...props}>
      <p>&copy; 2025 {process.env.SITE_NAME}. All rights reserved.</p>
    </footer>
  );
}
