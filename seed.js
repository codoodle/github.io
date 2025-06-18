import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseDir = join(__dirname, "src", "contents");
const categoryNames = faker.helpers.uniqueArray(faker.lorem.word, 16);
const tagNames = faker.helpers.uniqueArray(faker.lorem.word, 16);

const createIndexMarkdown = (name, description) => `---
name: ${name}
description: ${description}
---

# ${faker.lorem.sentence({ min: 3, max: 5 })}

${faker.lorem.paragraphs(5)}`;

const createPostMarkdown = ({
  author,
  title,
  description,
  datePublished,
  dateModified,
  tags,
}) => `---
author: ${author}
title: ${title}
description: ${description}
datePublished: ${datePublished}
dateModified: ${dateModified}${tags ? `\ntags:\n${tags.map((m) => `  - name: ${m.name}\n    slug: ${m.slug}`).join("\n")}` : ""}
---

${faker.lorem.paragraphs(5)}`;

async function* genCategories(parentDir, count, depth = 1, maxDepth = 3) {
  const names = categoryNames.splice(0, count);
  for (const name of names) {
    const description = faker.lorem.sentences(2);
    const slug = faker.helpers.slugify(name);
    const dir = join(parentDir, slug);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "index.md"),
      createIndexMarkdown(
        name.charAt(0).toUpperCase() + name.slice(1),
        description,
      ),
      "utf-8",
    );
    console.log(`📁 Created category: ${dir}`);
    for await (const _ of genPosts(dir, Math.floor(Math.random() * 2) + 1)) {
      /* empty */
    }

    if (depth < maxDepth && Math.random() < 0.6) {
      for await (const _ of genCategories(
        dir,
        Math.floor(Math.random() * 2) + 1,
        depth + 1,
        maxDepth,
      )) {
        /* empty */
      }
    }
    yield void 0;
  }
}

async function* genPosts(dir, count) {
  for (let i = 0; i < count; i++) {
    const author = faker.person.fullName();
    const title = faker.lorem.sentence({ min: 3, max: 5 });
    const description = faker.lorem.sentences(2);
    const datePublished = faker.date.past().toISOString();
    const dateModified = faker.date
      .between({ from: datePublished, to: new Date() })
      .toISOString();
    const tagsCount = Math.floor(Math.random() * (tagNames.length / 2)) + 1;
    const tags = Array.from({ length: tagsCount }, () =>
      faker.helpers.arrayElement(tagNames),
    )
      .filter((f, i, a) => a.indexOf(f) === i)
      .map((m) => ({
        name: m,
        slug: faker.helpers.slugify(m),
      }));
    const filename = `${faker.string.uuid()}.md`;
    const file = join(dir, filename);
    await writeFile(
      file,
      createPostMarkdown({
        author,
        title,
        description,
        datePublished,
        dateModified,
        tags,
      }),
      "utf-8",
    );
    console.log(`📄 Created post: ${file}`);
    yield void 0;
  }
}

var existsFiles = await readdir(baseDir, {});
await Promise.all(
  existsFiles
    .filter((file) => file !== "index.ts")
    .map((file) =>
      rm(join(baseDir, file), {
        recursive: true,
      }),
    ),
);

await writeFile(
  join(baseDir, "index.md"),
  createIndexMarkdown("Codoodle", "Codoodle's blog"),
  "utf-8",
);

for await (const _ of genCategories(baseDir, 4)) {
  /* empty */
}
