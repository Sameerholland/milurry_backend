const mongoose = require("mongoose");

const SuppliereSchema = new mongoose.Schema(
  {
    First_Name: { type: String, required: true },
    Last_Name: { type: String, required: true },
    Mail_ID: { type: String, required: true },
    Phone_Number: { type: Number, required: true, unique: true },
    Products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    Address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    Orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    Salt: Buffer,
    Hash_Password: Buffer,
  },
  { timestamps: true }
);

exports.Supplier = mongoose.model("Supplier", SuppliereSchema);
