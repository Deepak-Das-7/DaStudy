import ChapterModel from "../../models/Chapter";

import type {
    ChapterSeedSource,
} from "../types/seedTypes";

import {
    findClassByNumber,
    findSubjectBySlug,
} from "../utils/seedHelpers";

export const seedChapters = async (
    sources: ChapterSeedSource[]
): Promise<number> => {
    let count = 0;

    for (const source of sources) {
        const classItem = await findClassByNumber(
            source.classNumber
        );

        if (!classItem) {
            console.warn(
                `Class ${source.classNumber} not found for chapters.`
            );

            continue;
        }

        for (const subjectSource of source.data) {
            const subject = await findSubjectBySlug(
                classItem._id,
                subjectSource.subjectSlug
            );

            if (!subject) {
                console.warn(
                    `Subject ${subjectSource.subjectSlug} not found for Class ${source.classNumber}.`
                );

                continue;
            }

            const chapters = subjectSource.chapters.map(
                (chapter) => ({
                    ...chapter,
                    subjectId: subject._id,
                })
            );

            if (chapters.length === 0) {
                continue;
            }

            await ChapterModel.insertMany(chapters);

            count += chapters.length;
        }
    }

    return count;
};