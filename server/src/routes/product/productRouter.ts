import { Router } from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
} from "@controllers/product/productController";
import { verifyRole } from "@middlewares/verifyRole";
import { verifyToken } from "@middlewares/verifyToken";
import { UserRole } from "@models/user/userRoleEnum";
import { deleteRequestFile } from "@utils/deleteUploadedFile";
import { productImageValidation } from "@controllers/product/productImageValidator";
import { fileDetails } from "@utils/fileTypeUtils";
import { responseToClient } from "@utils/response";

export const productRouter = Router();

productRouter.post(
  "/product",
  verifyToken,
  verifyRole(UserRole.ADMIN),
  async (req, res, next) => {
    productImageValidation(req, res, (err) => {
      if (err) {
        if (req.file) {
          return deleteRequestFile(
            req.file as fileDetails,
            "uploads",
            "product",
          );
        }
        return responseToClient(
          res,
          false,
          400,
          err.message ?? "Upload error!",
        );
      }
      next();
    });
  },
  createProductController,
);
productRouter.get("/products", getAllProductsController);
productRouter.get("/product/:id", getProductByIdController);

export default productRouter;
