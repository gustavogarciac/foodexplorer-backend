const { Router } = require("express");
const dishesRoutes = Router();

const DishesController = require("../controllers/DishesController");
const dishesController = new DishesController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", dishesController.create);
dishesRoutes.delete("/:id", dishesController.delete);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);

module.exports = dishesRoutes;
