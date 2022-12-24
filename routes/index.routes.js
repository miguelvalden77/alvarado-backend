const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes)

const productRoutes = require("./product.routes")
router.use("/product", productRoutes)

const uploadRoutes = require("./uploader.routes")
router.use("/uploader", uploadRoutes)

const transactionRoutes = require("./transactions.routes")
router.use("/transaction", transactionRoutes)

module.exports = router;
