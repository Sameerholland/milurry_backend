const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    Title: { type: String, required: true, unique: true },
    Discription: { type: String, required: true },
    Category: { type: [String], required: true },
    Size:{type:[String],required:true},
    Gender:{type:String},
    Brand: { type: String, required: true },
    Price: { type: Number, required: true },
    DiscountPercent: { type: Number, default: 0 },
    Rating: {
      type: Number,
      default: 0,
      min: [0, "Rating can't be less than 0"],
      max: [5, "Rating can't more than 5"],
    },
    Reviews: { type: Number, default: 0 },
    Stock: {
      type: Number,
      required: true,
      min: [0, "Minimum Qunatity of Product is 0"],
    },
    Supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    Thumbnail: { type: Number, required: true },
    Images: { type: [String], required: true },
    Status: { type: String, default: "available" },
  },
  { timestamps: true }
);

exports.Product = mongoose.model("Product", ProductSchema);
