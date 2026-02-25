import express from "express";
import { PORT } from "./src/config/env.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import authRouter from "./src/routers/auth.router.js";
import cookieParser from "cookie-parser";
import { apiReference } from "@scalar/express-api-reference";
import swaggerSpec from "./src/config/swagger.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));
app.use("/docs", apiReference({ content: swaggerSpec }));


app.use("/api/auth",authRouter);
app.get("/", (req, res) => {
    res.send("welcome to tiny gate");
});



app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});