import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageConsent extends Document {
  userId: mongoose.Types.ObjectId;
  sourceUrl: string;
  accepted: boolean;
  acceptedAt: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UsageConsentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sourceUrl: { type: String, required: true },
    accepted: { type: Boolean, required: true },
    acceptedAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUsageConsent>('UsageConsent', UsageConsentSchema);
