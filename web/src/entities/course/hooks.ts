import { queryOptions } from "@tanstack/react-query";

import { fetchAllCourses } from "./db";

const allCoursesQueryKey = () => ["AllCourses"];

function useAllCoursesQueryOptions() {
  const key = allCoursesQueryKey();
  return queryOptions({
    queryKey: key,
    queryFn: () => fetchAllCourses(),
    staleTime: Infinity,
  });
}

export { useAllCoursesQueryOptions };
