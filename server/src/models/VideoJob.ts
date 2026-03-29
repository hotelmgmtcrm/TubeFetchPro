import mongoose, { Schema, Document } from 'mongoose';

export interface IVideoJob extends Document {
  userId: mongoose.Types.ObjectId;
  inputType: 'single_video' | 'channel_video';
  sourceUrl: string;
  channelUrl?: string;
  channelName?: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  outputType: 'mp4' | 'mp3';
  quality: string;
  customFilename?: string;
  status: 'pending' | 'validating' | 'processing' | 'converting' | 'uploading' | 'completed' | 'failed';
  cloudUrl?: string;
  cloudPublicId?: string;
  fileSize?: number;
  errorMessage?: string;
  consentAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoJobSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inputType: { type: String, enum: ['single_video', 'channel_video'], required: true },
    sourceUrl: { type: String, required: true },
    channelUrl: { type: String },
    channelName: { type: String },
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: Number, default: 0 },
    outputType: { type: String, enum: ['mp4', 'mp3'], required: true },
    quality: { type: String, required: true },
    customFilename: { type: String },
    status: {
      type: String,
      enum: ['pending', 'validating', 'processing', 'converting', 'uploading', 'completed', 'failed'],
      default: 'pending',
    },
    cloudUrl: { type: String },
    cloudPublicId: { type: String },
    fileSize: { type: Number },
    errorMessage: { type: String },
    consentAccepted: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVideoJob>('VideoJob', VideoJobSchema);
