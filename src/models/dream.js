import mongoose, { Schema } from "mongoose";

const dreamSchema = new Schema(
  {
    title: { type: String, required: true }, // Dream title
    description: { type: String, required: true }, // Detailed dream description
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the dream

    // 🌙 Immersive dream-related fields
    date: { type: Date, default: Date.now }, // Date when the dream happened
    mood: { type: String }, // Emotional tone of the dream
    lucidity: { type: Boolean, default: false }, // Was it a lucid dream?
    tags: [{ type: String }], // Keywords or themes
    intensity: { type: Number, min: 1, max: 10 }, // Intensity level
    recurring: { type: Boolean, default: false }, // Was it recurring?
    location: { type: String }, // Dream setting
    characters: [{ type: String }], // People/entities in the dream
    interpretation: { type: String }, // Personal meaning or analysis
    type: {
      type: String,
      enum: ["cauchemar", "lucide", "autre"], // Type of dream
      default: "rêve",
    },

    // 🧘 Well-being & sleep tracking fields
    beforeSleepMood: { type: String }, // Mood before going to sleep
    sleepTime: { type: Date }, // Time the user went to bed
    wokeUpTime: { type: Date }, // Time the user woke up
    dreamClarity: { type: Number, min: 1, max: 10 }, // How clearly the dream is remembered

    // 🎙️ Extras
    audioNote: { type: String }, // URL to an audio file
    images: [{ type: String }], // List of image URLs
    dreamScore: { type: Number, min: 1, max: 10 }, // User's personal rating
    private: { type: Boolean, default: false }, // Visibility toggle
  },
  {
    timestamps: true, // Auto-generated createdAt and updatedAt fields
  }
);

const Dream = mongoose.models.Dream || mongoose.model("Dream", dreamSchema);
export default Dream;
