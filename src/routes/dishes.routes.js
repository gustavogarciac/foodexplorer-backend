const { Router } = require("express");
const dishesRoutes = Router();

const multer = require("multer");
const uploadsConfig = require("../configs/upload");
const upload = multer(uploadsConfig.MULTER);

const DishesController = require("../controllers/DishesController");
const dishesController = new DishesController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", upload.single("image"), dishesController.create);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.put("/:id", dishesController.update);

module.exports = dishesRoutes;
