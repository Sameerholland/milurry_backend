const { Customer } = require("../Model/Customer");

exports.FetchUser = async (req, res) => {
  console.log("Fetch User API Called");
  try {
    const data = await Customer.findById({ _id: req.body.id });
    if (!data) {
      return res.status(401).json({ message: "invalid credentials" }); // for safety
    }
    res
      .status(200)
      .json({
        _id: data._id,
        First_Name: data.First_Name,
        Last_Name: data.Last_Name,
        Mail_ID: data.Mail_ID,
        Category: data.Category,
        Profile_pic: data.Profile_Pic,
      });
  } catch (err) {
    console.log(err, "Working");
    res.status(401).json(err);
  }
};

exports.AddCategory = async (req,res)=>{
   console.log("Add Category API Called");
   try{

      const data = await Customer.findByIdAndUpdate({_id:req.body.id},{$push:{Category:req.body.Category}})
      res.status(200).json(data)

   }
   catch (err){
      console.log(err);
      res.status(401).json(err);

   }
}

exports.UpdateProfilepic = async (req,res)=>{
  console.log("Update Profile pic API Called");
  try{
    const response = await Customer.findByIdAndUpdate({_id:req.body.id},{Profile_Pic:req.body.Profile_pic});
    res.status(200).json(response)

  }
  catch(err){
    console.log(err);
    res.status(400).json(err);

  }
}
