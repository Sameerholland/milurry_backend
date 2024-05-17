const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    State: { type: String, required: true, lowercase: true },
    Street: { type: String, required: true, lowercase: true },
    District: { type: String, required: true, lowercase: true },
    Zip_Code: { type: Number, required: true },
  },
  { timestamps: true }
);

exports.Address = mongoose.model("Address", AddressSchema);
