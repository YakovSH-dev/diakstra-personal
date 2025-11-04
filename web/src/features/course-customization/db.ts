import { doc, updateDoc } from "firebase/firestore";

import type { UserCourse_DB } from "@/entities/user-course/types";

import { firestore } from "@/shared/firebase";
import { paths } from "@/shared/paths";

async function setCourseColorDB(
  userId: string,
  courseId: string,
  customColor: UserCourse_DB["customColor"],
): Promise<void> {
  const semesterId = "1";
  const path = paths.user.userCourses(userId, semesterId) + "/" + courseId;
  const ref = doc(firestore, path);
  try {
    await updateDoc(ref, {
      customColor: customColor,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { setCourseColorDB };
