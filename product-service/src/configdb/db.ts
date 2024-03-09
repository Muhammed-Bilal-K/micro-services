import mongoose from "mongoose";
let mongoUrl : string  = process.env.MONGO_URL!;
mongoose.connect(mongoUrl);

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('product on db Connected')
});

require('../models/productModel');