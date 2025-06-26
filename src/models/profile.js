import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
        name: { type: String, required: true }, // User's name
        email: { type: String, required: true, unique: true }, // User's email address
        bio: { type: String }, // Short biography or description
        avatarUrl: { type: String }, // URL to the user's avatar image
        location: { type: String }, // User's location
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
    );

export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);
