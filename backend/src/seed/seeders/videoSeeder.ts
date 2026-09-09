import VideoModel from "../../models/Video";

import type {
    VideoSeedSource,
} from "../types/seedTypes";

import {
    findClassByNumber,
    findSubjectBySlug,
    findChapterBySlug,
} from "../utils/seedHelpers";

export const seedVideos = async (
    sources: VideoSeedSource[]
): Promise<number> => {
    let count = 0;

    for (const source of sources) {
        const classItem = await findClassByNumber(
            source.classNumber
        );

        if (!classItem) {
            console.warn(
                `Class ${source.classNumber} not found for videos.`
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
                    `Subject ${chapterSource.subjectSlug} not found for videos.`
                );

                continue;
            }

            const chapter = await findChapterBySlug(
                subject._id,
                chapterSource.chapterSlug
            );

            if (!chapter) {
                console.warn(
                    `Chapter ${chapterSource.chapterSlug} not found for videos.`
                );

                continue;
            }

            const videos = chapterSource.videos.map(
                (video) => ({
                    ...video,
                    chapterId: chapter._id,
                })
            );

            if (videos.length === 0) {
                continue;
            }

            await VideoModel.insertMany(videos);

            count += videos.length;
        }
    }

    return count;
};