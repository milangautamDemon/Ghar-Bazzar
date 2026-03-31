import { errorHandler } from "@middlewares/errorMiddleware";
import Favourite from "@models/fav/favModel";
import Product from "@models/product/productModel";
import User from "@models/user/userModel";
import { payloadValidator } from "@utils/payloadValidator";
import { responseToClient, serverError } from "@utils/response";
import { RequestHandler } from "express";
import mongoose from "mongoose";

export const toggleWishListController: RequestHandler = async (req, res) => {
  try {
    payloadValidator(req as any);
    const { userId } = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseToClient(res as any, false, 400, "Invalid user!");
    }

    const isUserExists = await User.findById(userId);
    if (!isUserExists) {
      return responseToClient(res as any, false, 400, "User does not exist!");
    }
    const { productId } = (req as any).body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return responseToClient(res as any, false, 400, "Invalid product!");
    }

    const isProductExists = await Product.findById(productId);
    if (!isProductExists) {
      return responseToClient(
        res as any,
        false,
        400,
        "Product does not exist!",
      );
    }

    let isAlreadyFav = await Favourite.findOne({ userId, productId });

    if (isAlreadyFav) {
      await Favourite.deleteOne({ userId, productId });
    } else {
      await Favourite.create({ userId, productId });
    }

    const populatedFavouriteList = await Favourite.find({ userId }).populate(
      "productId",
      "name address price imageUrl",
    );

    return responseToClient(
      res as any,
      true,
      200,
      isAlreadyFav
        ? "Product added to favourite list successfully!"
        : "Product removed from favourite list successfully!",
      populatedFavouriteList,
    );
  } catch (error) {
    errorHandler(error as Error, res as any);
  }
};

export const getUserFavListController: RequestHandler = async (req, res) => {
  try {
    const { userId } = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseToClient(res as any, false, 400, "Invalid user!");
    }

    const isUserExists = await User.findById(userId);
    if (!isUserExists) {
      return responseToClient(res as any, false, 400, "User does not exist!");
    }

    const userFavouriteList = await Favourite.find({ userId }).populate(
      "productId",
      "name address price imageUrl",
    );

    return responseToClient(
      res as any,
      true,
      200,
      "Favourite list fetched successfully!",
      userFavouriteList,
    );
  } catch (error) {
    errorHandler(error as Error, res as any);
  }
};

export default {
  toggleWishListController,
  getUserFavListController,
};
