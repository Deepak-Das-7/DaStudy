import { Types } from "mongoose";

import ClassModel from "../../models/Class";
import SubjectModel from "../../models/Subject";
import ChapterModel from "../../models/Chapter";

export const findClassByNumber = async (
    classNumber: number
) => {
    return ClassModel.findOne({
        classNumber,
    });
};

export const findSubjectBySlug = async (
    classId: Types.ObjectId,
    slug: string
) => {
    return SubjectModel.findOne({
        classId,
        slug,
    });
};

export const findChapterBySlug = async (
    subjectId: Types.ObjectId,
    slug: string
) => {
    return ChapterModel.findOne({
        subjectId,
        slug,
    });
};