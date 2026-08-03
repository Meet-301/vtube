import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
   getSearchHistory,
   removeFromHistory,
   search,
} from "../controllers/search.controller.js";

const searchRouter = Router();

searchRouter.route("/search").get(verifyJWT, search);
searchRouter.route("/search-history").get(verifyJWT, getSearchHistory);

searchRouter
   .route("/search-history/remove")
   .delete(verifyJWT, removeFromHistory);

export default searchRouter;
