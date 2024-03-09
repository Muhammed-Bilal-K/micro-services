import mongoose, { Schema } from "mongoose";
import { IProduct } from "../inference/Iproduct";

const productSchema : Schema = new mongoose.Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);


export default mongoose.model<IProduct>('Product', productSchema);

