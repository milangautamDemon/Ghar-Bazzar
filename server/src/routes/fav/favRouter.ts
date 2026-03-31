import favController from "@controllers/fav/favController";
import { verifyToken } from "@middlewares/verifyToken";
import { Router } from "express";

export const favRouter = Router();

favRouter.use(verifyToken);

favRouter.post("/fav/toggle", favController.toggleWishListController);
favRouter.get("/fav/lists", favController.getUserFavListController);

export default favRouter;
