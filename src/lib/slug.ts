export function generateSlug(dir: string | string[], name?: string) {
  const arr = Array.isArray(dir) ? dir : dir.split("/");
  return arr.concat(name ? [name] : []).join("/");
}

export function toSlugArray(slug: string) {
  return slug.split("/").filter((f) => !!f);
}
