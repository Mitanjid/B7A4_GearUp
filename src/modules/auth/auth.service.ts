import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { IRegisterUser, ILoginUser } from "./auth.interface";

const registerUser = async (payload: IRegisterUser) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
    omit: { password: true },
  });

  return user;
};

const loginUser = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("No user found with this email");
  }

  if (user.status === "SUSPENDED") {
    throw new Error("Your account has been suspended. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Incorrect password");
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expires_in!,
  );

  const { password, ...userWithoutPassword } = user;

  return { accessToken, user: userWithoutPassword };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
  });

  return user;
};

export const authService = { registerUser, loginUser, getMe };
