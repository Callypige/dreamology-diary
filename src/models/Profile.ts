import mongoose, { Schema, Model, Types } from "mongoose";

interface IProfile {
  user: Types.ObjectId;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  avatarUrl: { type: String },
  location: { type: String },
}, {
  timestamps: true,
});

const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;