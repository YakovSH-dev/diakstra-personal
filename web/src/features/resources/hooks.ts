import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

import { storage } from "@/shared/firebase";
import { paths } from "@/shared/paths";

import { useUserContext } from "@/entities/user/UserContext";
import { addResourceMetaToCourseDB } from "@/entities/user-course/db";
import { useUserCoursesQueryOptions } from "@/entities/user-course/hooks";
import type { ResourceMeta } from "@/entities/user-course/types";

function useGetResourceForCourseQO(courseId: string) {
  const userCoursesQO = useUserCoursesQueryOptions();
  return queryOptions({
    ...userCoursesQO,
    select: (data) => data[courseId].resources,
  });
}

function useAddResourceMO() {
  const { profile } = useUserContext();
  return mutationOptions({
    mutationFn: async ({
      courseId,
      resource,
    }: {
      courseId: string;
      resource: File | string;
      resourceMeta: Omit<ResourceMeta, "url">;
    }) => {
      if (!profile) throw new Error("Not logged in");
      const resourceData = {} as ResourceMeta;
      const id = crypto.randomUUID();

      if (resource instanceof File) {
        resourceData.storagePath = paths.storage.userResourceDOC(
          profile.userId,
          id,
        );
        const r = ref(storage, resourceData.storagePath);
        await uploadBytes(r, resource);
        const url = await getDownloadURL(r);
        resourceData.url = url;
      }

      if (!resourceData.url && !(resourceData instanceof File))
        resourceData.url = resource as string;

      return addResourceMetaToCourseDB(profile.userId, courseId, resourceData);
    },
  });
}

export { useAddResourceMO, useGetResourceForCourseQO };
