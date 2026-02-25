import swaggerJsdoc from "swagger-jsdoc"
import { PORT } from "./env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Modern API Docs with Scalar"
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ["./src/routers/*.js"]
}

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;