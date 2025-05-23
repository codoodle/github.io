export const PAGE_SIZE = 5;

export function paginate<T>(items: T[], page: number, itemsPerPage = 10): T[] {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
}
