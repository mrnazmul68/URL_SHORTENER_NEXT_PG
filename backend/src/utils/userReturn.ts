import type { User } from "../../generated/prisma/client.js";

export const userReturn = (user: User): Omit<User, "password"> => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
