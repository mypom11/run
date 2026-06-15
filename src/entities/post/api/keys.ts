export const postKeys = {
  all: ["post"] as const,
  list: (categoryId: string | null) =>
    [...postKeys.all, "list", categoryId ?? "all"] as const,
  categories: () => [...postKeys.all, "categories"] as const,
};
