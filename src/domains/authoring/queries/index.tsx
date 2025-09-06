import { useQuery } from "@tanstack/react-query";
import { getCategories, getLessons } from "../apis";

type TGetLessonsParams = {
  authorId: string;
};

type TGetCategoryParams = {
  id?: string;
  search?: string;
};

export const LESSON_QUERY_KEY_NAME = "lesson";
export const CATEGORY_QUERY_KEY_NAME = "category";

export const useGetLessons = ({ authorId }: TGetLessonsParams) => {
  return useQuery({
    queryKey: [LESSON_QUERY_KEY_NAME, { authorId }],
    queryFn: () => getLessons(authorId),
    enabled: !!authorId,
  });
};

export const useGetCategories = ({ id, search }: TGetCategoryParams) => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY_NAME, id, search],
    queryFn: () => getCategories(id, search),
  });
};
