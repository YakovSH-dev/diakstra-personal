import type { DiakstraUser } from "./types";

function createUser(userId: string, university: string): DiakstraUser {
  return {
    userId: userId,
    university: university,
  };
}

export { createUser };
