const express = require("express");
const { CreateSupplier } = require("../Controller/Supplier");

const router = express.Router();
router.post("/add", CreateSupplier);

exports.router = router;
