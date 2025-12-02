import mongoose, { Schema, Model, Types } from "mongoose";

interface IDream {
  title: string; // Title field
  description: string; // Description field
  user: Types.ObjectId; // Reference to User model
  date: Date; // Date of the dream
  mood?: string; // Mood associated with the dream
  lucidity: boolean; // Whether the dream was lucid
  tags?: string[]; // Tags associated with the dream
  intensity?: number; // Intensity of the dream
  recurring: boolean; // Whether the dream is recurring
  location?: string; // Location of the dream
  characters?: string[]; // Characters in the dream
  interpretation?: string; // Interpretation of the dream
  type: "normal" | "cauchemar" | "lucide" | "autre"; // Type of the dream
  beforeSleepMood?: string; // Mood before sleep
  sleepTime?: Date; // Time of sleep
  wokeUpTime?: Date; // Time of waking up
  dreamClarity?: number; // Clarity of the dream
  audioNote?: string; // Audio note associated with the dream
  images?: string[]; // Images associated with the dream
  dreamScore?: number; // Score of the dream
  private: boolean; // Whether the dream is private
  createdAt: Date; // Creation date
  updatedAt: Date; // Last update date
}

const dreamSchema = new Schema<IDream>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  mood: { type: String },
  lucidity: { type: Boolean, default: false },
  tags: [{ type: String }],
  intensity: { type: Number, min: 1, max: 10 },
  recurring: { type: Boolean, default: false },
  location: { type: String },
  characters: [{ type: String }],
  interpretation: { type: String },
  type: {
    type: String,
    enum: ["normal", "cauchemar", "lucide", "autre"],
    default: "normal",
  },
  beforeSleepMood: { type: String },
  sleepTime: { type: Date },
  wokeUpTime: { type: Date },
  dreamClarity: { type: Number, min: 1, max: 10 },
  audioNote: { type: String },
  images: [{ type: String }],
  dreamScore: { type: Number, min: 1, max: 10 },
  private: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Dream: Model<IDream> = mongoose.models.Dream || mongoose.model<IDream>("Dream", dreamSchema);

export default Dream;