import mongoose from "mongoose";
let mongoUrl = 'mongodb+srv://bilalmuhammed192:8Ax4BbyN6Iuqlo94@cluster0.ys0pdmm.mongodb.net/orderService?retryWrites=true&w=majority'
mongoose.connect(mongoUrl);

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('orders db Connected')
});

require('../models/ordersModel');