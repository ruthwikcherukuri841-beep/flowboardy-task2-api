import mongoose from "mongoose";

const json = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
};

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["active", "completed", "on-hold"], default: "active" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: String, default: "" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

projectSchema.set("toJSON", json);

export const Project = mongoose.models.Project ?? mongoose.model("Project", projectSchema);
