import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface ICreateGear {
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  stock?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  categoryId: string;
}

interface IGearFilters {
  searchTerm?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
}

const createGear = async (providerId: string, payload: ICreateGear) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.gearItem.create({
    data: { ...payload, providerId },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
  });
};

const getAllGear = async (filters: IGearFilters) => {
  const { searchTerm, category, brand, minPrice, maxPrice, isAvailable } =
    filters;

  const andConditions: Prisma.GearItemWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { brand: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (category) {
    andConditions.push({ categoryId: category });
  }

  if (brand) {
    andConditions.push({ brand: { equals: brand, mode: "insensitive" } });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      pricePerDay: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }

  if (isAvailable !== undefined) {
    andConditions.push({ isAvailable: isAvailable === "true" });
  }

  const whereConditions: Prisma.GearItemWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  return prisma.gearItem.findMany({
    where: whereConditions,
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getGearById = async (id: string) => {
  return prisma.gearItem.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, name: true, email: true } },
      reviews: true,
    },
  });
};

const updateGear = async (
  id: string,
  providerId: string,
  payload: Partial<ICreateGear>,
) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({ where: { id } });

  if (gear.providerId !== providerId) {
    throw new Error("You are not allowed to update this gear item");
  }

  return prisma.gearItem.update({ where: { id }, data: payload });
};

const deleteGear = async (id: string, providerId: string) => {
  const gear = await prisma.gearItem.findUniqueOrThrow({ where: { id } });

  if (gear.providerId !== providerId) {
    throw new Error("You are not allowed to delete this gear item");
  }

  return prisma.gearItem.delete({ where: { id } });
};

const getProviderGear = async (providerId: string) => {
  return prisma.gearItem.findMany({
    where: { providerId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

export const gearService = {
  createGear,
  getAllGear,
  getGearById,
  updateGear,
  deleteGear,
  getProviderGear,
};
