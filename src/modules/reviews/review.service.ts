import { prisma } from "../../lib/prisma";

interface ICreateReview {
  rentalOrderId: string;
  rating: number;
  comment?: string;
}

const createReview = async (customerId: string, payload: ICreateReview) => {
  const rentalOrder = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: payload.rentalOrderId },
  });

  if (rentalOrder.customerId !== customerId) {
    throw new Error("You are not allowed to review this rental order");
  }

  if (rentalOrder.status !== "RETURNED") {
    throw new Error(
      "You can only review a rental order after the gear has been returned",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: { rentalOrderId: payload.rentalOrderId },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this rental order");
  }

  return prisma.review.create({
    data: {
      customerId,
      gearItemId: rentalOrder.gearItemId,
      rentalOrderId: payload.rentalOrderId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: { select: { id: true, name: true } },
    },
  });
};

const getReviewsByGearId = async (gearItemId: string) => {
  return prisma.review.findMany({
    where: { gearItemId },
    include: { customer: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewService = {
  createReview,
  getReviewsByGearId,
};
