import mongoose, { Schema, Document } from "mongoose";

export interface ISearch extends Document {
  term: string;
  count: number;
  lastSearchedAt: Date;
}

const searchSchema = new Schema<ISearch>({
  term: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  lastSearchedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Search ||
  mongoose.model<ISearch>("Search", searchSchema);
