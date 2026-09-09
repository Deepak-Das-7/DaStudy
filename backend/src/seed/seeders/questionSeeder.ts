import QuestionModel from "../../models/Question";

import type {
    QuestionSeedSource,
} from "../types/seedTypes";

import {
    findClassByNumber,
    findSubjectBySlug,
    findChapterBySlug,
} from "../utils/seedHelpers";

export const seedQuestions = async (
    sources: QuestionSeedSource[]
): Promise<number> => {
    let count = 0;

    for (const source of sources) {
        const classItem = await findClassByNumber(
            source.classNumber
        );

        if (!classItem) {
            console.warn(
                `Class ${source.classNumber} not found for questions.`
            );

            continue;
        }

        for (const chapterSource of source.data) {
            const subject = await findSubjectBySlug(
                classItem._id,
                chapterSource.subjectSlug
            );

            if (!subject) {
                console.warn(
                    `Subject ${chapterSource.subjectSlug} not found for questions.`
                );

                continue;
            }

            const chapter = await findChapterBySlug(
                subject._id,
                chapterSource.chapterSlug
            );

            if (!chapter) {
                console.warn(
                    `Chapter ${chapterSource.chapterSlug} not found for questions.`
                );

                continue;
            }

            const questions =
                chapterSource.questions.map(
                    (question) => ({
                        ...question,
                        chapterId: chapter._id,
                    })
                );

            if (questions.length === 0) {
                continue;
            }

            await QuestionModel.insertMany(
                questions
            );

            count += questions.length;
        }
    }

    return count;
};