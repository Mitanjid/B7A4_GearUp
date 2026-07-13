import { prisma } from "../../lib/prisma";

const createCategory = async (payload: {
  name: string;
  description?: string;
}) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new Error("A category with this name already exists");
  }

  return prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({ where: { id } });
  return category;
};

const updateCategory = async (
  id: string,
  payload: { name?: string; description?: string },
) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  return prisma.category.update({ where: { id }, data: payload });
};

const deleteCategory = async (id: string) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  return prisma.category.delete({ where: { id } });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
