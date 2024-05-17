const { Order } = require("../Model/Order");

exports.CreateOrder = async (req,res)=>{
   console.log("Create Order API Called");
   try{
      const order = new Order(req.body)
      const result = await order.save();
      res.status(200).json(result)
   }
   catch(err){
      console.log(err);
      res.status(400).json(err)
   }
}

exports.FetchOrder = async (req,res)=>{
   console.log("Fetch Order API Called");
   try{
      const order = await Order.find({Supplier:req.params.id})
      res.status(200).json(order)
   }
   catch(err){
      console.log(err);
      res.status(400).json(err)

   }
}