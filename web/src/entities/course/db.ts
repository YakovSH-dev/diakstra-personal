import { collection, query, where, getDocs } from "firebase/firestore";

import { firestore } from "@/shared/firebase";
import { paths } from "@/shared/paths";

import type { Course, Course_DB } from "./types";
import { convertCourseDBtoCL } from "./object";

async function fetchCourses(courseIds: string[]): Promise<Course[]> {
  if (courseIds.length === 0) return [] as Course[];
  const university = "technion";
  const semesterId = "1";
  const path = paths.catalog.courses(university, semesterId);
  const ref = collection(firestore, path);
  const q = query(ref, where("id", "in", courseIds));
  try {
    const docs = await getDocs(q);
    const data = docs.docs.map((d) => d.data() as Course_DB);

    return data.map((c) => convertCourseDBtoCL(c));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchAllCourses(): Promise<Course[]> {
  const university = "technion";
  const semesterId = "1";
  const path = paths.catalog.courses(university, semesterId);
  const ref = collection(firestore, path);
  try {
    const docs = await getDocs(ref);
    const data = docs.docs.map((d) =>
      convertCourseDBtoCL(d.data() as Course_DB),
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { fetchCourses, fetchAllCourses };
