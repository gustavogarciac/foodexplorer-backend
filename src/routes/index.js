const { Router } = require("express");
const router = Router();

const usersRoutes = require("./users.routes");
const dishesRoutes = require("./dishes.routes");
const sessionsRoutes = require("./sessions.routes");

router.use("/users", usersRoutes);
router.use("/dishes", dishesRoutes);
router.use("/auth", sessionsRoutes);

module.exports = router;
