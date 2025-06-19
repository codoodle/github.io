import { blog } from "@/contents";

export default function Footer(props: React.ComponentProps<"footer">) {
  return (
    <footer {...props}>
      <div className="text-sm">
        <div>&copy; 2025 {blog.name}. All rights reserved.</div>
      </div>
      <div className="mt-3 text-xs text-gray-500">{blog.description}</div>
    </footer>
  );
}
