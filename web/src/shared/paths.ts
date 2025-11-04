const paths = {
  catalog: {
    courses: (university: string, semesterId: string) =>
      `universities/${university}/semester/${semesterId}/courses`,
  },
  user: {
    userCourses: (userId: string, semesterId: string) =>
      `users/${userId}/semesters/${semesterId}/courses`,
    profile: (userId: string) => `users/${userId}`,
  },
  storage: {
    userResourceCOL: (userId: string) => `users/${userId}/resources`,
    userResourceDOC: (userId: string, resourceId: string) =>
      `users/${userId}/resources/${resourceId}`,
  },
};

export { paths };
