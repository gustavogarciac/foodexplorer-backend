require("express-async-errors");
require("dotenv").config();

const AppError = require("./utils/AppError");
const cors = require("cors");

const express = require("express");
const server = express();

server.use(cors());
server.use(express.json());
const router = require("./routes");

server.use(router);

server.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error.",
  });
});

const port = process.env.PORT || 3333;
server.listen(port, () =>
  console.log(`🚀 Servidor inicializado em http://localhost:${port}`)
);
