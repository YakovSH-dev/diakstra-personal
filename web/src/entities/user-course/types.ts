import type { Course, SessionType, SlotIndex } from "../course/types";

type UserCourse_DB = {
  userId: string;
  courseId: string;
  courseProgress: CourseProgressDB;
  courseSelectedSections: Record<SessionType, string | null>;
  customColor?: string;
  resources: ResourceMeta[];
};

type UserCourse = {
  userId: string;
  courseId: string;
  courseMeta: Course;
  courseProgress: CourseProgress;
  courseSelectedSections: Record<SessionType, string | null>;
  customColor?: string;
  resources: ResourceMeta[];
};

type ResourceMeta = {
  title: string;
  url: string;
  week?: number;
  sessionType?: string;
  storagePath?: string;
};

type UserCourseCache = Record<Course["id"], UserCourse>;

type WeekNumber = number;

type WeeklySessionTypeProgress = Record<WeekNumber, Set<SlotIndex>>;
type WeeklySessionTypeProgressDB = Record<WeekNumber, SlotIndex[]>;

type CourseProgress = Record<SessionType, WeeklySessionTypeProgress>;
type CourseProgressDB = Record<SessionType, WeeklySessionTypeProgressDB>;

export type {
  UserCourse,
  UserCourse_DB,
  UserCourseCache,
  CourseProgress,
  CourseProgressDB,
  WeeklySessionTypeProgress,
  WeeklySessionTypeProgressDB,
  WeekNumber,
  ResourceMeta,
};
