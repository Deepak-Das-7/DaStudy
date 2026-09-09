import { Schema, model, Document, Types } from "mongoose";

export interface IVideo extends Document {
    chapterId: Types.ObjectId;
    title: string;
    youtubeVideoId: string;
    channelName: string;
    language: string;
    order: number;
    isPublished: boolean;
}

const videoSchema = new Schema<IVideo>(
    {
        chapterId: {
            type: Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        youtubeVideoId: {
            type: String,
            required: true,
            trim: true,
        },

        channelName: {
            type: String,
            required: true,
            trim: true,
        },

        language: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            enum: ["en", "hi"],
            default: "en",
        },

        order: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

videoSchema.index({
    chapterId: 1,
    isPublished: 1,
    order: 1,
});

const VideoModel = model<IVideo>("Video", videoSchema);

export default VideoModel;