import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  roomId: string;       // 6-char alphanumeric code, e.g. "ABC123"
  title: string;        // Human-readable title set by the creator
  createdBy: string;    // Display name of the creator
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 6,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Prevent model re-compilation on hot-reload
const Room: Model<IRoom> =
  mongoose.models.Room ?? mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
