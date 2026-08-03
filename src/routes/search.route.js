import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { search } from "../controllers/search.controller.js";

const searchRouter = Router()

searchRouter.route("/search").get(verifyJWT, search)

export default searchRouter