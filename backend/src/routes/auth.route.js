import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()
// if we write all the controllers here the file will be cluttered , we need to write them in their own separate files
router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute,updateProfile)  //protect route to make sure not everyone can update you need to be logged in

router.get("/check", protectRoute , checkAuth)



export default router;