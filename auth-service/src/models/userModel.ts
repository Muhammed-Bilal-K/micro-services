import mongoose, { Schema } from "mongoose";
import { IUser } from "../inference/Iuser";

const userSchema : Schema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


export default mongoose.model<IUser>('User', userSchema);

