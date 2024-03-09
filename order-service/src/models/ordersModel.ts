import mongoose, { Schema } from "mongoose";
import { IOrders } from "../inference/Iorders";

const orderSchema : Schema = new mongoose.Schema<IOrders>(
    {
        orderlist: [
                {
                productId : String,
            }
        ],
        userId: {
            type: String,
            required: true,
        },
        totalprice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);


export default mongoose.model<IOrders>('Orders', orderSchema);

