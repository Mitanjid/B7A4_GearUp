import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    omit: { password: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (id: string, status: "ACTIVE" | "SUSPENDED") => {
  await prisma.user.findUniqueOrThrow({ where: { id } });

  return prisma.user.update({
    where: { id },
    data: { status },
    omit: { password: true },
  });
};

const getAllGear = async () => {
  return prisma.gearItem.findMany({
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllRentals = async () => {
  return prisma.rentalOrder.findMany({
    include: {
      gearItem: {
        include: {
          category: true,
          provider: { select: { id: true, name: true, email: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true } },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
