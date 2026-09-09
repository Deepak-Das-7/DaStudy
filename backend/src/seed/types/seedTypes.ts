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
    language: string;
    isPublished: boolean;
};

export type ChapterSubjectSeed = {
    subjectSlug: string;
    chapters: ChapterSeedItem[];
};

export type NoteSeedItem = {
    title: string;
    content: string;
    language: string;
    order: number;
    isPublished: boolean;
};

export type NoteChapterSeed = {
    subjectSlug: string;
    chapterSlug: string;
    notes: NoteSeedItem[];
};

export type VideoSeedItem = {
    title: string;
    youtubeVideoId: string;
    channelName: string;
    language: string;
    order: number;
    isPublished: boolean;
};

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
    language: string;
    order: number;
    isPublished: boolean;
};

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