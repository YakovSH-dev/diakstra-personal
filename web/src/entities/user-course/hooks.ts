import {
  useQueryClient,
  queryOptions,
  mutationOptions,
} from "@tanstack/react-query";

import { useUserContext } from "../user/UserContext";
import { fetchCourses } from "../course/db";
import type { Course, SlotIndex } from "../course/types";

import {
  fetchUserCourses,
  addUserCourseDB,
  setSelectedSectionIdDB,
  toggleTimeslotsDB,
  deleteUserCourseDB,
} from "./db";
import {
  createUserCourse,
  createUserCourse_DB,
  toggleSelectedSection,
  toggleTimeslots,
} from "./object";
import type { UserCourseCache } from "./types";

const userCoursesQueryKey = (uid?: string) => ["userCourses", uid];

function useUserCoursesQueryOptions() {
  const { profile } = useUserContext();
  const key = userCoursesQueryKey(profile?.userId);
  return queryOptions({
    queryKey: key,
    queryFn: async () => {
      const userCoursesData = await fetchUserCourses(profile!.userId);

      const courseIds = userCoursesData.map((c) => c.courseId);
      const courses = await fetchCourses(courseIds);

      const userCourses: UserCourseCache = userCoursesData.reduce(
        (acc, ucd) => {
          const course = courses.find((c) => c.id === ucd.courseId);
          if (!course) return acc;
          acc[course.id] = createUserCourse(ucd, course);
          return acc;
        },
        {} as UserCourseCache,
      );

      return userCourses;
    },
    enabled: !!profile,
  });
}

function useAddUserCourseMutationOptions() {
  const { profile } = useUserContext();
  const qc = useQueryClient();
  return mutationOptions({
    onMutate: (course) => {
      if (!profile) return;
      const key = userCoursesQueryKey(profile.userId);
      qc.cancelQueries({ queryKey: key });
      const userCourse_DB = createUserCourse_DB(profile.userId, course.id);
      const newUserCourse = createUserCourse(userCourse_DB, course);
      qc.setQueryData(key, (data: UserCourseCache) => {
        return { ...data, [newUserCourse.courseId]: newUserCourse };
      });
    },

    mutationFn: (course: Course) => {
      if (!profile) throw new Error("User not logger in");
      const userCourse_DB = createUserCourse_DB(profile.userId, course.id);

      return addUserCourseDB(profile.userId, userCourse_DB);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userCoursesQueryKey(profile?.userId) });
    },
  });
}

function useDeleteUserCourseMO() {
  const { profile } = useUserContext();
  const qc = useQueryClient();
  return mutationOptions({
    onMutate: (courseId) => {
      qc.setQueryData(
        userCoursesQueryKey(profile?.userId),
        (data: UserCourseCache) => {
          return Object.fromEntries(
            Object.entries(data).filter((e) => e[0] != courseId),
          );
        },
      );
      if (!profile) return;
    },
    mutationFn: (courseId: string) => {
      return deleteUserCourseDB(profile!.userId, courseId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userCoursesQueryKey(profile?.userId) });
    },
  });
}

function useToggleSelectedSectionMO() {
  const { profile } = useUserContext();
  const qc = useQueryClient();
  return mutationOptions({
    onMutate: ({ courseId, sessionType, sectionId }) => {
      if (!profile) return;
      qc.cancelQueries({ queryKey: userCoursesQueryKey(profile.userId) });
      qc.setQueryData(
        userCoursesQueryKey(profile.userId),
        (data: UserCourseCache) => {
          const course = data[courseId];
          const toggledCourse = toggleSelectedSection(
            course,
            sessionType,
            sectionId,
          );

          const updatedCache = { ...data, [courseId]: toggledCourse };
          return updatedCache;
        },
      );
    },
    mutationFn: ({
      courseId,
      sectionId,
      sessionType,
    }: {
      courseId: string;
      sessionType: string;
      sectionId: string;
    }) => {
      const course = (
        qc.getQueryData(userCoursesQueryKey(profile?.userId)) as UserCourseCache
      )[courseId];

      if (sectionId != course.courseSelectedSections[sessionType]) {
        console.log("Section id ", sectionId, " toggled off");
      }

      return setSelectedSectionIdDB(
        profile!.userId,
        courseId,
        sessionType,
        course.courseSelectedSections[sessionType],
      );
    },
  });
}

function useToggleTimeslotsMO() {
  const { profile } = useUserContext();
  const qc = useQueryClient();
  return mutationOptions({
    onMutate: ({
      courseId,
      sessionType,
      weekNumber,
      timeslots,
    }: {
      courseId: string;
      sessionType: string;
      weekNumber: number;
      timeslots: Set<SlotIndex>;
    }) => {
      if (!profile) return;
      qc.setQueryData(
        userCoursesQueryKey(profile.userId),
        (data: UserCourseCache) => {
          const course = data[courseId];
          const toggled = toggleTimeslots(
            course,
            sessionType,
            weekNumber,
            timeslots,
          );
          const updated = { ...data, [courseId]: toggled };
          return updated;
        },
      );
    },
    mutationFn: ({ courseId, sessionType, weekNumber }) => {
      const course = (
        qc.getQueryData(userCoursesQueryKey(profile?.userId)) as UserCourseCache
      )[courseId];

      const progressArray = [...course.courseProgress[sessionType][weekNumber]];

      return toggleTimeslotsDB(
        profile!.userId,
        courseId,
        sessionType,
        weekNumber,
        progressArray,
      );
    },
  });
}

export {
  userCoursesQueryKey,
  useUserCoursesQueryOptions,
  useAddUserCourseMutationOptions,
  useDeleteUserCourseMO,
  useToggleSelectedSectionMO,
  useToggleTimeslotsMO,
};
