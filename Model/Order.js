const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    Title:{type:String, required:true},
    Status: { type: String, default: "On The Way" },
    Category:{type:String},
    Price: { type: Number, min: [0, "Price is must be greater than zero"] },
    Dilevery_Charge: {
      type: Number,
      min: [0, "Dilevery is can't less than 0"],
    },
    Quantity: {
      type: Number,
      default: 0,
      min: [1, "Quantity can't less than 1"],
    },
    Customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    Supplier:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Cusomer',
      required:true
    },
    Product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    Payment_Method: {
      type: String,
      required: true,
      enum: { values: ["Cash", "Card"], message: `{VALUE} is not supported` },
    },
    Order_Date:{type:Date,required:true},
    Dievery_Date:{type:Date,required:true}
  },
  { timestamps: true }
);

exports.Order = mongoose.model("Order", OrderSchema);
