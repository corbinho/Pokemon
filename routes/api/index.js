const router = require("express").Router();
const minionRoutes = require("./minion");

// minion routes
router.use("/minion", minionRoutes);

module.exports = router;