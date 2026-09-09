import type {
    ContentLanguage,
} from "../utils/contentConstants";

export type ContentMetadata = {
    language: ContentLanguage;
    isPublished: boolean;
};

export type ClassSeedItem = {
    classNumber: number;
    name: string;
};

export type SubjectSeedItem = {
    name: string;
    slug: string;
};

export type ChapterSeedItem = {
    chapterNumber: number;
    name: string;
    slug: string;
    description?: string;
} & ContentMetadata;

export type ChapterSubjectSeed = {
    subjectSlug: string;
    chapters: ChapterSeedItem[];
};

export type NoteSeedItem = {
    title: string;
    content: string;
    order: number;
} & ContentMetadata;

export type NoteChapterSeed = {
    subjectSlug: string;
    chapterSlug: string;
    notes: NoteSeedItem[];
};

export type VideoSeedItem = {
    title: string;
    youtubeVideoId: string;
    channelName: string;
    order: number;
} & ContentMetadata;

export type VideoChapterSeed = {
    subjectSlug: string;
    chapterSlug: string;
    videos: VideoSeedItem[];
};

export type QuestionSeedItem = {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    order: number;
} & ContentMetadata;

export type QuestionChapterSeed = {
    subjectSlug: string;
    chapterSlug: string;
    questions: QuestionSeedItem[];
};

export type ChapterSeedSource = {
    classNumber: number;
    data: ChapterSubjectSeed[];
};

export type NoteSeedSource = {
    classNumber: number;
    data: NoteChapterSeed[];
};

export type VideoSeedSource = {
    classNumber: number;
    data: VideoChapterSeed[];
};

export type QuestionSeedSource = {
    classNumber: number;
    data: QuestionChapterSeed[];
};