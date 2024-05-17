const { Product } = require("../Model/Product");

exports.AddProducts = async (req,res)=>{
   console.log("Add Product API Called");
   try {
      const product = new Product(req.body)
      const result = await product.save();
      res.status(200).json(result)
   }
   catch(err){
      console.log(err)
      res.status(400).json(err)
   }
}

exports.FetchProducts = async (req,res)=>{
   console.log("Fetch Product Called API Called")
   

   let query = Product.find({Supplier_id:req.params.id});
   let totalqueryProducts =  Product.find({Supplier_id:req.params.id});

   if(req.query._sort && req.query._order){
      query = query.sort({[req.query._sort]:req.query._order})
   }

   if(req.query._page && req.query._limit){
      const pagesize = req.query._page;
      const page = req.query._limit;
      query = query.skip(pagesize * (page - 1)).limit(pagesize)
   }
   
   
   
   try {
      const totaldocs = await totalqueryProducts.countDocuments().exec()
      console.log(totaldocs)
      const docs = await query.exec();
      res.set("X-total-count",totaldocs)
      res.status(200).json({product:docs,totalitems:totaldocs})

   }
   catch(err){
      res.status(400).json(err)
   }
}