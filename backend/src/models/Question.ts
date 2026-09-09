import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Document {
    chapterId: Types.ObjectId;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    language: string;
    order: number;
    isPublished: boolean;
}

const questionSchema = new Schema<IQuestion>(
    {
        chapterId: {
            type: Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },

        question: {
            type: String,
            required: true,
            trim: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: (value: string[]) => value.length >= 2,
                message: "A question must have at least 2 options",
            },
        },

        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
        },

        explanation: {
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

questionSchema.index({
    chapterId: 1,
    isPublished: 1,
    order: 1,
});

const QuestionModel = model<IQuestion>(
    "Question",
    questionSchema
);

export default QuestionModel;