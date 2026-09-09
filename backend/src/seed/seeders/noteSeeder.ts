import NoteModel from "../../models/Note";

import type {
    NoteSeedSource,
} from "../types/seedTypes";

import {
    findClassByNumber,
    findSubjectBySlug,
    findChapterBySlug,
} from "../utils/seedHelpers";

export const seedNotes = async (
    sources: NoteSeedSource[]
): Promise<number> => {
    let count = 0;

    for (const source of sources) {
        const classItem = await findClassByNumber(
            source.classNumber
        );

        if (!classItem) {
            console.warn(
                `Class ${source.classNumber} not found for notes.`
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
                    `Subject ${chapterSource.subjectSlug} not found for notes.`
                );

                continue;
            }

            const chapter = await findChapterBySlug(
                subject._id,
                chapterSource.chapterSlug
            );

            if (!chapter) {
                console.warn(
                    `Chapter ${chapterSource.chapterSlug} not found for notes.`
                );

                continue;
            }

            const notes = chapterSource.notes.map(
                (note) => ({
                    ...note,
                    chapterId: chapter._id,
                })
            );

            if (notes.length === 0) {
                continue;
            }

            await NoteModel.insertMany(notes);

            count += notes.length;
        }
    }

    return count;
};