import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

/**
 * Category
 * @typedef {{name:string, description: string, children: Category[], dir: string}} Category
 */

const baseDir = "./contents";
const categoryNames = faker.helpers.uniqueArray(faker.lorem.word, 8);
const tagNames = faker.helpers.uniqueArray(faker.lorem.word, 16);

if (fs.existsSync(baseDir)) {
  fs.rmSync(baseDir, {
    recursive: true,
  });
}
fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(
  path.join(baseDir, "_.md"),
  `## ${faker.lorem.sentence()}

${faker.lorem.paragraphs(2)}`,
  "utf-8",
);

/**
 * Generate categories.
 * @param {string} parentDir
 * @param {number | undefined} count
 * @returns {{name:string, description: string, children, dir: string}}
 */
const genCategories = (parentDir, count) => {
  const items = [...categoryNames.splice(0, count ?? Math.floor(Math.random() * 3) + 1)].map(
    (m) => {
      const name = m.charAt(0).toUpperCase() + m.slice(1);
      const description = faker.lorem.sentences(2);
      const slug = faker.helpers.slugify(m);
      const dir = path.join(parentDir, slug);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(dir, "_.md"),
        `---
name: ${name}
description: ${description}
---

## ${name}

${description}

${faker.lorem.paragraphs(5)}`,
        "utf-8",
      );
      const children = genCategories(dir);
      return {
        name,
        description,
        children,
        dir,
      };
    },
  );
  return items;
};

/**
 * Generate posts.
 * @param {string} dir
 * @param {number | undefined} count
 */
const genPosts = (dir, count) => {
  const length = count ?? Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < length; i++) {
    const title = faker.lorem.sentence();
    const description = faker.lorem.sentences(2);
    const datePublished = faker.date.past().toISOString();
    const dateModified = faker.date.between({ from: datePublished, to: new Date() }).toISOString();
    const slug = faker.helpers.slugify(title.toLowerCase());
    const tags = Math.round(Math.random())
      ? Array.from({ length: tagNames.length / 2 }, () => faker.helpers.arrayElement(tagNames))
          .filter((f, i, a) => a.indexOf(f) === i)
          .map((m) => ({
            name: m,
            slug: faker.helpers.slugify(m),
          }))
      : undefined;
    fs.writeFileSync(
      path.join(dir, `${slug}.md`),
      `---
title: ${title}
description: ${description}
datePublished: ${datePublished}
dateModified: ${dateModified}${tags ? `\ntags:\n${tags.map((m) => `  - name: ${m.name}\n    slug: ${m.slug}`).join("\n")}` : ""}
---

${faker.lorem.paragraphs(5)}`,
      "utf-8",
    );
  }
};

/**
 * @param {Category[]} categories
 * @returns {Category[]}
 */
const flat = (categories) => {
  const items = [];
  for (const category of categories) {
    items.push(category);
    items.push(...flat(category.children));
  }
  return items;
};

for (const category of flat(genCategories(baseDir, 4))) {
  genPosts(category.dir);
}
