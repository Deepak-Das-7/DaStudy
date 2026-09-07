import { Schema, model, Document, Types } from "mongoose";

export interface ISubject extends Document {
    classId: Types.ObjectId;
    name: string;
    slug: string;
}

const subjectSchema = new Schema<ISubject>(
    {
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
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
    },
    {
        timestamps: true,
    }
);

subjectSchema.index(
    { classId: 1, slug: 1 },
    { unique: true }
);

const SubjectModel = model<ISubject>(
    "Subject",
    subjectSchema
);

export default SubjectModel;