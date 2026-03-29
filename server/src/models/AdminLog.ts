import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetId?: mongoose.Types.ObjectId;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminLogSchema: Schema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    details: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAdminLog>('AdminLog', AdminLogSchema);
