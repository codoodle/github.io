import { categories, contentFromSlug, posts } from "@/lib/contentlayer";
import { toSlugArray } from "@/lib/slug";
import { ImageResponse } from "next/og";

export function generateStaticParams() {
  return [
    {
      slug: ["image"],
    },
    ...categories.map((m) => ({
      slug: [...toSlugArray(m.slug), "image"],
    })),
    ...posts.map((m) => ({
      slug: [...toSlugArray(m.slug), "image"],
    })),
  ];
}

export async function GET(request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: slugArray } = await params;
  const currentSlug = slugArray?.slice(0, -1).join("/");
  const { categories: currentCategories } = contentFromSlug(currentSlug);

  return new ImageResponse(
    (
      <div
        style={{
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          height: "100%",
          padding: "32px 48px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "radial-gradient(circle at center, #191919, black)",
            display: "flex",
            height: "630px",
            position: "absolute",
            width: "1200px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            height: "630px",
            position: "absolute",
            width: "1200px",
          }}
        >
          {Array.from({ length: 14 })
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                style={{
                  background: "radial-gradient(circle at center, black, transparent)",
                  height: "2px",
                  left: "0",
                  position: "absolute",
                  top: `${(i + 1) * 65 - 10}px`,
                  width: "1200px",
                }}
              ></div>
            ))}
          {Array.from({ length: 26 })
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                style={{
                  background: "radial-gradient(circle at center, black, transparent)",
                  bottom: "0",
                  left: `${(i + 1) * 65 - 16}px`,
                  position: "absolute",
                  top: "0",
                  width: "2px",
                }}
              ></div>
            ))}
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <svg
              width="128"
              height="128"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: "invert(1)",
              }}
            >
              <path
                d="M6.89443 6.44719C7.14142 5.95321 6.94119 5.35254 6.44721 5.10555C5.95324 4.85856 5.35256 5.05878 5.10557 5.55276L2.10557 11.5528C1.96481 11.8343 1.96481 12.1657 2.10557 12.4472L5.10557 18.4472C5.35256 18.9412 5.95324 19.1414 6.44721 18.8944C6.94119 18.6474 7.14142 18.0467 6.89443 17.5528L4.11803 12L6.89443 6.44719Z"
                fill="black"
              />
              <path
                d="M17.1056 6.44719C16.8586 5.95321 17.0588 5.35254 17.5528 5.10555C18.0468 4.85856 18.6474 5.05878 18.8944 5.55276L21.8944 11.5528C22.0352 11.8343 22.0352 12.1657 21.8944 12.4472L18.8944 18.4472C18.6474 18.9412 18.0468 19.1414 17.5528 18.8944C17.0588 18.6474 16.8586 18.0467 17.1056 17.5528L19.882 12L17.1056 6.44719Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.2747 4.03849C14.8058 4.19021 15.1133 4.7437 14.9615 5.27473L10.9615 19.2747C10.8098 19.8058 10.2563 20.1133 9.72529 19.9615C9.19426 19.8098 8.88677 19.2563 9.03849 18.7253L13.0385 4.72529C13.1902 4.19426 13.7437 3.88677 14.2747 4.03849Z"
                fill="black"
              />
            </svg>
            <div
              style={{
                fontSize: "96px",
              }}
            >
              CODOODLE
            </div>
          </div>
        </div>
        {currentCategories.length > 0 && (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              left: "16px",
              position: "absolute",
              right: "16px",
              top: "16px",
            }}
          >
            {currentCategories.map((m) => (
              <div
                key={m._id}
                style={{
                  alignItems: "center",
                  border: "1px solid #333333",
                  backgroundColor: "#191919",
                  borderRadius: "8px",
                  display: "flex",
                  flexShrink: "0",
                  fontSize: "24px",
                  fontWeight: "600",
                  height: "48px",
                  padding: "0 16px",
                }}
              >
                {m.name}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
