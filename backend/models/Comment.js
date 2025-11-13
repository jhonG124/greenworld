import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fecha: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
