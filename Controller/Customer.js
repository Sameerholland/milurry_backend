const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Customer } = require("../Model/Customer");
const { SenitizeUser } = require("../Services/Commen");
const { sendmail, AccountCreatedTemplate } = require("../Services/Mail");
require("dotenv").config({ path: "./.env" });
const SECRET_KEY = process.env.SCERET_KEY;

//Api TO Create Customer.
exports.CreateCustomer = async (req, res) => {
  console.log("Create Customer API Called");
  console.log(req.body)
  //this check either user exist with given number or not
  try {
    const Salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.Password,
      Salt,
      3100,
      512,
      "sha256",
      async function (err, HashPassword) {
        const newcustomer = new Customer({
          Mail_ID: req.body.Mail_ID,
          Phone_Number: req.body.Phone_Number,
          First_Name: req.body.First_Name,
          Last_Name: req.body.Last_Name,
          Salt: Salt,
          Hash_Password: HashPassword,
        });
        const Result = await newcustomer.save();
        const token = jwt.sign(SenitizeUser(Result), SECRET_KEY);
        const email = req.body.Mail_ID;
        const subject = `Your Account Has been Created With ${req.body.Phone_Number}.`;
        const html = AccountCreatedTemplate();

        await sendmail({ to: email, subject, html });
        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 36000000),
            httpOnly: true,
          })
          .status(200)
          .json(SenitizeUser(Result));
      }
    );
  } catch (err) {
    res.status(400).json(err.message);
  }
};

//API To Login user

exports.LoginCustomer = async (req, res) => {
  console.log("Log In API Called");
  

  try {
    console.log(req.body.Phone_Number)

    const user = await Customer.findOne({ Phone_Number: req.body.Phone_Number });
    console.log( user);
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' }); // for safety
    }
    crypto.pbkdf2(
      req.body.Password,
      user.Salt,
      3100,
    512,
      "sha256",
      async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.Hash_Password, hashedPassword)) {
          console.log('working')
          return res.status(401).json({ message: 'invalid credentials' });
        }
        
        res.status(200).json( { id: user._id,Phone_Number: user.Phone_Number}); // this lines sends to serializer
      }
    );
  } catch (err) {
    console.log(err,"Working")
    res.status(401).json(err);
  }
};

exports.CheckCustomer = async (req, res) => {
  console.log("Check Customer API Called");
  if (req.user) res.json(req.user);
  else res.sendStatus(401);
};

exports.ResetPasswordRequest = async (req, res) => {
  console.log("Forget Password Request API Called");
  const email = req.body.email;
  const user = await Customer.findOne({ Mail_ID: email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    const resetpagelink =
      `http://localhost:3000/reset-password?token=` + token + `&email` + email;
    const subject = "reset password for Milurry";
    const html = `<p> Click <a href = ${resetpagelink}>here</a> to Reset Password</p>`;

    if (email) {
      const response = await sendmail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    sendStatus(400);
  }
};

exports.ResetPassword = async (req,res)=>{
  console.log("Reset Password API Called");
  const {email,Password,token} = req.body;

  const User = await Customer.findOne({Mail_ID:email,resetPasswordToken:token});
  if(User){
    const Salt = crypto.randomBytes(16);
    crypto.pbkdf2(Password,Salt,3100,512,'sha512', async function(err,HashPassword){
      User.Salt = Salt;
      User.Hash_Password =HashPassword;
      await User.save();

      const subject = 'Password Succesfully reset for Milurry Admin Panel';
      const html = `<p>Sucsesfully able to reset Password</p>`;
      if(email){
        const response = await sendmail({to:email,subject,html});
        res.json(response);
      }
      else{
        res.sendStatus(400);
      }
    })
  }
  else{
    res.sendStatus(400);
  }
}