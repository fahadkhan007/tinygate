import express from "express";
import { PORT } from "./src/config/env.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import authRouter from "./src/routers/auth.router.js";
import cookieParser from "cookie-parser";
import { apiReference } from "@scalar/express-api-reference";
import swaggerSpec from "./src/config/swagger.js";
import connectDB from "./src/database/database.js";
import userRouter from "./src/routers/user.router.js";
import urlRouter from "./src/routers/url.router.js";
import { redirectToOriginalUrl } from "./src/controllers/url.controller.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/docs", apiReference({ content: swaggerSpec }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/url", urlRouter);

app.get("/", (req, res) => {
    res.send("welcome to tiny gate");
});

app.get("/:urlId", redirectToOriginalUrl);

app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port http://localhost:${PORT}`);
    });
});
