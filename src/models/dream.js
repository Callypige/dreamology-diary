import mongoose, { Schema } from "mongoose";

const dreamSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
   
    }
);

const Dream = mongoose.models.Dream || mongoose.model("Dream", dreamSchema);

export default Dream;