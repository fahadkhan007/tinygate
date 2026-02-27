import { Router } from "express";
import { createShortUrl, getUserUrls } from "../controllers/url.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/url/shorten:
 *   post:
 *     tags:
 *       - URL
 *     summary: Create a short URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [originalUrl]
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://example.com/my-very-long-link
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/shorten", authMiddleware, createShortUrl);

/**
 * @openapi
 * /api/url/my-urls:
 *   get:
 *     tags:
 *       - URL
 *     summary: Get current user's URLs
 *     responses:
 *       200:
 *         description: URLs fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-urls", authMiddleware, getUserUrls);

export default router;
