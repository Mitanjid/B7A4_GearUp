import { prisma } from "../../lib/prisma";

interface ICreateRental {
  gearItemId: string;
  startDate: string;
  endDate: string;
}

const createRental = async (customerId: string, payload: ICreateRental) => {
  const gearItem = await prisma.gearItem.findUniqueOrThrow({
    where: { id: payload.gearItemId },
  });

  if (!gearItem.isAvailable || gearItem.stock < 1) {
    throw new Error("This gear item is currently not available for rent");
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalAmount = Number(gearItem.pricePerDay) * days;

  const rental = await prisma.$transaction(async (tx) => {
    const newRental = await tx.rentalOrder.create({
      data: {
        customerId,
        gearItemId: payload.gearItemId,
        startDate,
        endDate,
        totalAmount,
        status: "PLACED",
      },
      include: {
        gearItem: {
          include: {
            category: true,
            provider: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    await tx.gearItem.update({
      where: { id: payload.gearItemId },
      data: { stock: { decrement: 1 } },
    });

    return newRental;
  });

  return rental;
};

const getCustomerRentals = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { customerId },
    include: {
      gearItem: {
        include: {
          category: true,
          provider: { select: { id: true, name: true, email: true } },
        },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getRentalById = async (id: string) => {
  return prisma.rentalOrder.findUniqueOrThrow({
    where: { id },
    include: {
      gearItem: {
        include: {
          category: true,
          provider: { select: { id: true, name: true, email: true } },
        },
      },
      payments: true,
      customer: { select: { id: true, name: true, email: true } },
    },
  });
};

const getProviderRentals = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: { gearItem: { providerId } },
    include: {
      gearItem: true,
      customer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateRentalStatus = async (
  id: string,
  providerId: string,
  status: string,
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id },
    include: { gearItem: true },
  });

  if (rental.gearItem.providerId !== providerId) {
    throw new Error("You are not allowed to update this rental order");
  }

  if (rental.status === "RETURNED" || rental.status === "CANCELLED") {
    throw new Error(
      `Cannot update status of a ${rental.status.toLowerCase()} order`,
    );
  }

  const updatedRental = await prisma.rentalOrder.update({
    where: { id },
    data: { status: status as any },
  });

  if (status === "RETURNED" || status === "CANCELLED") {
    await prisma.gearItem.update({
      where: { id: rental.gearItemId },
      data: { stock: { increment: 1 } },
    });
  }

  return updatedRental;
};

const cancelRental = async (id: string, customerId: string) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({ where: { id } });

  if (rental.customerId !== customerId) {
    throw new Error("You are not allowed to cancel this rental order");
  }

  if (rental.status !== "PLACED") {
    throw new Error("Only orders with PLACED status can be cancelled");
  }

  const cancelledRental = await prisma.rentalOrder.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  await prisma.gearItem.update({
    where: { id: rental.gearItemId },
    data: { stock: { increment: 1 } },
  });

  return cancelledRental;
};

export const rentalService = {
  createRental,
  getCustomerRentals,
  getRentalById,
  getProviderRentals,
  updateRentalStatus,
  cancelRental,
};
