import { prisma } from "@lib";
import type { Prisma } from "../../../generated/prisma/client.js";

//todo: find user by id
export const findById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
};

//todo: find user by email
export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

//todo: register user
export const registerUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};
