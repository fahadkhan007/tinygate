import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = Router();

router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("name _id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ id: user._id, name: user.name });
    } catch (error) {
        next(error);
    }
});

export default router;