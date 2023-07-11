const { Router } = require("express")
const router = Router()

const usersRoutes = require("./users.routes")
const platesRoutes = require("./plates.routes")

router.use("/users", usersRoutes)
router.use("/plates", platesRoutes)

module.exports = router