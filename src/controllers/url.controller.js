import { Url } from "../models/url.model.js";
import { PORT } from "../config/env.js";

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const SHORT_ID_LENGTH = 7;
const MAX_GENERATION_TRIES = 5;
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const buildShortUrl = (urlId) => `${BASE_URL}/${urlId}`;

const generateUrlId = () => {
    let result = "";
    for (let i = 0; i < SHORT_ID_LENGTH; i += 1) {
        result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return result;
};

const createUniqueUrlId = async () => {
    for (let tries = 0; tries < MAX_GENERATION_TRIES; tries += 1) {
        const candidate = generateUrlId();
        const existing = await Url.exists({ urlId: candidate });
        if (!existing) {
            return candidate;
        }
    }

    const error = new Error("Unable to generate unique short URL. Please try again");
    error.statusCode = 503;
    throw error;
};

export const createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            const error = new Error("originalUrl is required");
            error.statusCode = 400;
            throw error;
        }

        const existingUrl = await Url.findOne({
            user: req.user.id,
            originalUrl,
        });

        if (existingUrl) {
            return res.status(200).json({
                message: "Short URL already exists",
                data: existingUrl,
            });
        }

        const urlId = await createUniqueUrlId();
        const shortUrl = buildShortUrl(urlId);

        const newUrl = await Url.create({
            user: req.user.id,
            urlId,
            originalUrl,
            shortUrl,
        });

        res.status(201).json({
            message: "Short URL created successfully",
            data: newUrl,
        });
    } catch (error) {
        next(error);
    }
};

export const redirectToOriginalUrl = async (req, res, next) => {
    try {
        const { urlId } = req.params;

        const urlDoc = await Url.findOneAndUpdate(
            { urlId },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!urlDoc) {
            const error = new Error("Short URL not found");
            error.statusCode = 404;
            throw error;
        }

        return res.redirect(urlDoc.originalUrl);
    } catch (error) {
        next(error);
    }
};

export const getUserUrls = async (req, res, next) => {
    try {
        const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "URLs fetched successfully",
            data: urls,
        });
    } catch (error) {
        next(error);
    }
};
