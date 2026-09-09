import type {
    ChapterSeedSource,
    NoteSeedSource,
    VideoSeedSource,
    QuestionSeedSource,
} from "../types/seedTypes";

export const printContentSummary = (params: {
    chapterSources: ChapterSeedSource[];
    noteSources: NoteSeedSource[];
    videoSources: VideoSeedSource[];
    questionSources: QuestionSeedSource[];
}): void => {
    let chapters = 0;
    let notes = 0;
    let videos = 0;
    let questions = 0;

    for (const source of params.chapterSources) {
        for (const subject of source.data) {
            chapters += subject.chapters.length;
        }
    }

    for (const source of params.noteSources) {
        for (const chapter of source.data) {
            notes += chapter.notes.length;
        }
    }

    for (const source of params.videoSources) {
        for (const chapter of source.data) {
            videos += chapter.videos.length;
        }
    }

    for (const source of params.questionSources) {
        for (const chapter of source.data) {
            questions += chapter.questions.length;
        }
    }

    console.log("");
    console.log("Content source summary");
    console.log("----------------------");
    console.log(`Chapters:   ${chapters}`);
    console.log(`Notes:      ${notes}`);
    console.log(`Videos:     ${videos}`);
    console.log(`Questions:  ${questions}`);
};