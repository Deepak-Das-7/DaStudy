import { Schema, model, Document, Types } from "mongoose";

export interface IChapter extends Document {
    subjectId: Types.ObjectId;
    chapterNumber: number;
    name: string;
    slug: string;
    description?: string;
    language: string;
    isPublished: boolean;
}

const chapterSchema = new Schema<IChapter>(
    {
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        chapterNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        language: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            enum: ["en", "hi"],
            default: "en",
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

chapterSchema.index(
    { subjectId: 1, chapterNumber: 1 },
    { unique: true }
);

chapterSchema.index(
    { subjectId: 1, slug: 1 },
    { unique: true }
);

chapterSchema.index({
    subjectId: 1,
    isPublished: 1,
});

const ChapterModel = model<IChapter>("Chapter", chapterSchema);

export default ChapterModel;