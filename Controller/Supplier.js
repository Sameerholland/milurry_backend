const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Supplier } = require("../Model/Supplier");
const { SenitizeUser } = require("../Services/Commen");

require("dotenv").config();
const SECRET_KEY = process.env.SCERET_KEY;

exports.CreateSupplier = async (req, res) => {
  console.log("Create Supplier API Called");
  try {
    const Salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.Password,
      Salt,
      3200,
      512,
      "sha512",
      async function (err, HashPassword) {
        const newSupplier = new Supplier({
          First_Name: req.body.First_Name,
          Last_Name: req.body.Last_Name,
          Mail_ID: req.body.Mail_ID,
          Phone_Number:req.body.Phone_Number,
          Salt: Salt,
          Hash_Password: HashPassword,
        });
        const result = await newSupplier.save();
        const token = jwt.sign(SenitizeUser(result), SECRET_KEY);

        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 36000000),
            httpOnly: true,
          })
          .status(200)
          .json(SenitizeUser(result));
      }
    );
  } catch (err) {
    console.log(err)
    res.status(400).json({error:err.message});
  }
};
