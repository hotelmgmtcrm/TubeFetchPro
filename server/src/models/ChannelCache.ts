import mongoose, { Schema, Document } from 'mongoose';

export interface IChannelCache extends Document {
  channelUrl: string;
  channelName: string;
  avatar?: string;
  handle?: string;
  fetchedVideos: any[];
  lastFetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChannelCacheSchema: Schema = new Schema(
  {
    channelUrl: { type: String, required: true, unique: true },
    channelName: { type: String, required: true },
    avatar: { type: String },
    handle: { type: String },
    fetchedVideos: [{ type: Schema.Types.Mixed }], // flexible schema for yt-dlp response
    lastFetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IChannelCache>('ChannelCache', ChannelCacheSchema);
