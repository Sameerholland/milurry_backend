const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    Phone_Number: { type: Number, unique: true, required: 'Phone Number Is Required', },
    First_Name: { type: String, required: true, lowercase: true },
    Last_Name: { type: String, lowercase:true},
    Mail_ID:{type:String},
    Category:{type:[String]},
    Size:{type:[String]},
    Gender:{type:[String]},
    Profile_Pic:{type:String},
    Products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    Address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    Orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    Salt: Buffer,
    Hash_Password: Buffer,
    resetPasswordToken: {type: String, default:''}
  },
  { timestamps: true }
);

exports.Customer = mongoose.model("Customer", CustomerSchema);
