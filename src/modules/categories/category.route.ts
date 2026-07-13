import { Router } from "express";
import { categoryController } from "./category.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryValidationSchema, updateCategoryValidationSchema } from "./category.validation";



const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

router.post("/" , auth(Role.ADMIN), 
validateRequest(createCategoryValidationSchema),
categoryController.createCategory
);

router.patch(
    "/:id", auth(Role.ADMIN), 
    validateRequest(updateCategoryValidationSchema),
    categoryController.updateCategory
);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes =router;
