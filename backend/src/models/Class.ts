import { Schema, model, Document } from "mongoose";

export interface IClass extends Document {
    classNumber: number;
    name: string;
}

const classSchema = new Schema<IClass>(
    {
        classNumber: {
            type: Number,
            required: true,
            unique: true,
            min: 1,
            max: 12,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ClassModel = model<IClass>("Class", classSchema);

export default ClassModel;