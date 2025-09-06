import { authInstance } from "@/shared/lib/axios";

export const getLessons = async (authorId: string) => {
  return authInstance.get("/lesson/all", { params: { authorId: authorId } });
};

export const getCategories = async (id?: string, name?: string) => {
  return authInstance.get("/category", {
    params: {
      id,
      search: name,
    },
  });
};
