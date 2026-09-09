import { class6ChapterData } from "./data/chapters/class6";
import { class7ChapterData } from "./data/chapters/class7";

import { class6NoteData } from "./data/notes/class6";
import { class6VideoData } from "./data/videos/class6";
import { class6QuestionData } from "./data/questions/class6";

type ChapterItem = {
    chapterNumber: number;
    name: string;
    slug: string;
    description?: string;
    language: string;
    isPublished: boolean;
};

type ChapterSubjectData = {
    subjectSlug: string;
    chapters: ChapterItem[];
};

type NoteItem = {
    title: string;
    content: string;
    language: string;
    order: number;
    isPublished: boolean;
};

type NoteChapterData = {
    subjectSlug: string;
    chapterSlug: string;
    notes: NoteItem[];
};

type VideoItem = {
    title: string;
    youtubeVideoId: string;
    channelName: string;
    language: string;
    order: number;
    isPublished: boolean;
};

type VideoChapterData = {
    subjectSlug: string;
    chapterSlug: string;
    videos: VideoItem[];
};

type QuestionItem = {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    language: string;
    order: number;
    isPublished: boolean;
};

type QuestionChapterData = {
    subjectSlug: string;
    chapterSlug: string;
    questions: QuestionItem[];
};

export type ChapterSeedSource = {
    classNumber: number;
    data: ChapterSubjectData[];
};

export type NoteSeedSource = {
    classNumber: number;
    data: NoteChapterData[];
};

export type VideoSeedSource = {
    classNumber: number;
    data: VideoChapterData[];
};

export type QuestionSeedSource = {
    classNumber: number;
    data: QuestionChapterData[];
};

export const chapterSources: ChapterSeedSource[] = [
    {
        classNumber: 6,
        data: class6ChapterData,
    },

    {
        classNumber: 7,
        data: class7ChapterData,
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