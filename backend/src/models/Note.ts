import { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
    chapterId: Types.ObjectId;
    title: string;
    content: string;
    language: string;
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
            default: "en",
        },
    },
    {
        timestamps: true,
    }
);

noteSchema.index({
    chapterId: 1,
});

const NoteModel = model<INote>("Note", noteSchema);

export default NoteModel;