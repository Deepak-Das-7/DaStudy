import { class6ChapterData } from "./data/chapters/class6";
import { class7ChapterData } from "./data/chapters/class7";
import { class8ChapterData } from "./data/chapters/class8";

import { class6NoteData } from "./data/notes/class6";

import { class6VideoData } from "./data/videos/class6";

import { class6QuestionData } from "./data/questions/class6";

import type {
    ChapterSeedSource,
    NoteSeedSource,
    VideoSeedSource,
    QuestionSeedSource,
} from "./types/seedTypes";

export const chapterSources: ChapterSeedSource[] = [
    {
        classNumber: 6,
        data: class6ChapterData,
    },
    {
        classNumber: 7,
        data: class7ChapterData,
    },
    {
        classNumber: 8,
        data: class8ChapterData,
    },
];

export const noteSources: NoteSeedSource[] = [
    {
        classNumber: 6,
        data: class6NoteData,
    },
];

export const videoSources: VideoSeedSource[] = [
    {
        classNumber: 6,
        data: class6VideoData,
    },
];

export const questionSources: QuestionSeedSource[] = [
    {
        classNumber: 6,
        data: class6QuestionData,
    },
];