const orderModel = require("../models/orderModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Placing User Order for Frontend
// const placeOrder = async (req, res) => {
//      try {
//          const newOrder = new orderModel({
//              userId: req.body.userId,
//              items: req.body.items,
//              amount: req.body.amount,
//             address: req.body.address,
//         })
//          await newOrder.save();
//          await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//          const line_items = req.body.items.map((item) => ({
//              price_data: {
//               currency: "inr",
//               product_data: {
//                 name: item.name
//               },
//               unit_amount: item.price*100*80
//             },
//             quantity: item.quantity
//           }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charge"
//                 },
//                 unit_amount: 5*80*100
//             },
//             quantity:1
//         })


//           const session = await stripe.checkout.sessions.create({
//             success_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `http://localhost:5173/verify?success=false&orderId=${newOrder._id}`,
//             line_items: line_items,
//             mode: 'payment',
//           });

//           res.json({success:true,session_url:session.url});

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error" })
//     }
// }



const placeOrder = async (req, res) => {
  try {
    const { paymentMethod, upiId } = req.body;

    // Create the new order document
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: paymentMethod || 'stripe',
      upiId: upiId || '',
      payment: paymentMethod === 'cod' ? false : false, // COD orders are marked as unpaid until delivered
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Handle different payment methods
    if (paymentMethod === 'cod') {
      // Cash on Delivery - Order placed successfully, payment on delivery
      res.json({
        success: true,
        message: 'Order placed successfully! Payment will be collected on delivery.',
        orderId: newOrder._id
      });
    } else if (paymentMethod === 'upi') {
      // UPI Payment - Order placed, UPI ID saved for verification
      res.json({
        success: true,
        message: 'Order placed successfully! Please complete payment using UPI.',
        orderId: newOrder._id,
        upiId: upiId
      });
    } else {
      // Stripe Payment - Create checkout session
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Delivery Charge',
          },
          unit_amount: 5,
        },
        quantity: 1,
      });

      // Create the Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `http://localhost:5173/verify?success=false&orderId=${newOrder._id}`,
        line_items: line_items,
        mode: 'payment',
        customer_email: req.body.address.email,
        shipping_address_collection: {
          allowed_countries: ['IN'],
        },
      });

      res.json({ success: true, session_url: session.url });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};











// Listing Order for Admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    res.json({ success: false, message: "Error" })
  }

}

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" })
    }
    else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    res.json({ success: false, message: "Not  Verified" })
  }

}

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await productModel.countDocuments({});
    const totalOrders = await orderModel.countDocuments({});
    const totalUsers = await userModel.countDocuments({});

    const revenueResult = await orderModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        products: totalProducts,
        orders: totalOrders,
        revenue: totalRevenue.toLocaleString('en-IN'),
        users: totalUsers
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching dashboard stats" });
  }
}



module.exports = {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  getDashboardStats
};