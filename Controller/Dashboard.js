const { Order } = require("../Model/Order")
const moment = require('moment')

exports.FetchDashboardData = async (req,res)=>{
  console.log("Fetch Dashboard Data API Called");
  console.log(req.params)


  const date = new Date();
  const date1 = new Date();
  const onemonth = new Date();
  const oneday = new Date();
  onemonth.setDate(date.getDate() - 28);
  oneday.setDate(date1.getDate() -1)
  console.log(oneday)

  const onemonthfrom =  onemonth;
  const onedayfrom = oneday;

  const Grouped_data = Order.aggregate([{$group:{_id:"$Category",total:{$sum:1}}}]);
  const Order_status = Order.aggregate([{$group:{_id:"$Status",total:{$sum:1}}}])
  const Groupedresult = await Grouped_data.exec();
  const Orderstatus = await Order_status.exec();
  const finalresult = (Groupedresult.sort(function(a,b){
    return b.total - a.total
  }))
  const j = finalresult.shift()
  

  const onemonthorder =  Order.find( {
    Supplier:req.params.id,
    Order_Date: {
       $gte: new Date( onemonthfrom ).toISOString(),
    }
  } );

  const onedaysales = Order.find({

    Supplier:req.params.id,
    Order_Date: {
       $gte: new Date( onedayfrom ).toISOString(),
    }

  })

  const pending_order = Order.find({Supplier:req.params.id, Status:'pending'})


 
  
  try{
   const Order_Amount = await onemonthorder.countDocuments().exec();
   const Daily_sales = await onedaysales.countDocuments().exec();
   const PendingOrder = await pending_order.countDocuments().exec();
   console.log(Order_Amount)
   
   res.status(200).json({order_Amount:Order_Amount, Daily_sales:Daily_sales, pendingOrder:PendingOrder, Group_Data:finalresult, Order_status:Orderstatus})
  }
  catch(err){
   console.log(err)
  }
}