import { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
    chapterId: Types.ObjectId;
    title: string;
    content: string;
    language: string;
    order: number;
    isPublished: boolean;
}

const noteSchema = new Schema<INote>(
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

        content: {
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

noteSchema.index({
    chapterId: 1,
    isPublished: 1,
    order: 1,
});

const NoteModel = model<INote>("Note", noteSchema);

export default NoteModel;