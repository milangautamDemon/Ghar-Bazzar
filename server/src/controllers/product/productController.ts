import { errorHandler } from "@middlewares/errorMiddleware";
import Product from "@models/product/productModel";
import { fileDetails } from "@utils/fileTypeUtils";
import { getEnvironmentImageUrl } from "@utils/getEnvironmentImageUrl";
import { responseToClient, serverError } from "@utils/response";
import e, { RequestHandler } from "express";
import mongoose from "mongoose";

export const createProductController: RequestHandler = async (req, res) => {
  try {
    const { name, address, price } = req.body;
    let image;
    if (req.file) {
      const { filename } = req.file as fileDetails;
      image = `${getEnvironmentImageUrl()}/product/${filename}`;
    }
    const newProduct = new Product({ name, address, price, imageUrl: image });
    await newProduct.save();
    return responseToClient(
      res,
      true,
      201,
      "Product created successfully !",
      newProduct,
    );
  } catch (error) {
    errorHandler(error as Error, res);
  }
};

export const getAllProductsController: RequestHandler = async (req, res) => {
  try {
    const products = await Product.find();
    return responseToClient(
      res,
      true,
      200,
      "Products retrieved successfully !",
      products,
    );
  } catch (error) {
    errorHandler(error as Error, res);
  }
};

export const getProductByIdController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id as string) === false) {
      return responseToClient(res, false, 400, "Invalid product ID !");
    }
    const product = await Product.findById(id);
    if (!product) {
      return responseToClient(res, false, 404, "Product not found !");
    }
    return responseToClient(
      res,
      true,
      200,
      "Product retrieved successfully !",
      product,
    );
  } catch (error) {
    errorHandler(error as Error, res);
  }
};
