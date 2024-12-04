const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const apiDocRouter = express.Router();
const swaggerOptions = {};

apiDocRouter.use("/", swaggerUi.serve);
apiDocRouter.get("/", swaggerUi.setup(swaggerDocument, swaggerOptions));

module.exports = apiDocRouter;