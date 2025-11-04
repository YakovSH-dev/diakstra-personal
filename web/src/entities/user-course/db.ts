import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

import { firestore } from "@/shared/firebase";
import { paths } from "@/shared/paths";

import type { SlotIndex } from "../course/types";

import type { ResourceMeta, UserCourse_DB } from "./types";

async function fetchUserCourses(userId: string): Promise<UserCourse_DB[]> {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId);
  const ref = collection(firestore, path);
  try {
    const docs = await getDocs(ref);
    const data = docs.docs.map((d) => d.data() as UserCourse_DB);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addUserCourseDB(
  userId: string,
  course: UserCourse_DB,
): Promise<void> {
  const semesterId = "1";
  const path =
    paths.user.userCourses(userId, semesterId) + "/" + course.courseId;
  const ref = doc(firestore, path);
  try {
    return await setDoc(ref, course);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteUserCourseDB(
  userId: string,
  courseId: string,
): Promise<void> {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId) + "/" + courseId;
  const ref = doc(firestore, path);
  try {
    return await deleteDoc(ref);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setSelectedSectionIdDB(
  userId: string,
  courseId: string,
  sessionType: string,
  sectionId: string | null,
): Promise<void> {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId) + "/" + courseId;
  const ref = doc(firestore, path);
  try {
    await updateDoc(ref, {
      [`courseSelectedSections.${sessionType}`]: sectionId,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function toggleTimeslotsDB(
  userId: string,
  courseId: string,
  sessionType: string,
  weekNumber: number,
  toggled: SlotIndex[],
) {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId) + "/" + courseId;
  const ref = doc(firestore, path);
  try {
    await updateDoc(ref, {
      [`courseProgress.${sessionType}.${weekNumber}`]: toggled,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateUserCourseDB(
  userId: string,
  courseId: string,
  fieldPath: string,
  // eslint-disable-next-line
  fieldValue: any,
) {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId) + "/" + courseId;
  const ref = doc(firestore, path);
  try {
    await updateDoc(ref, {
      [`${fieldPath}`]: fieldValue,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addResourceMetaToCourseDB(
  userId: string,
  courseId: string,
  resourceMeta: ResourceMeta,
) {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId) + "/" + courseId;
  const ref = doc(firestore, path);
  try {
    await updateDoc(ref, { resources: arrayUnion(resourceMeta) });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {
  fetchUserCourses,
  addUserCourseDB,
  deleteUserCourseDB,
  toggleTimeslotsDB,
  setSelectedSectionIdDB,
  updateUserCourseDB,
  addResourceMetaToCourseDB,
};
