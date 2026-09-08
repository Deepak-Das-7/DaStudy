export type SearchClass = {
    _id: string;
    classNumber: number;
    name: string;
};

export type SearchSubject = {
    _id: string;
    classId: {
        _id: string;
        classNumber: number;
        name: string;
    };
    name: string;
    slug: string;
};

export type SearchChapter = {
    _id: string;
    subjectId: {
        _id: string;
    };
    chapterNumber: number;
    name: string;
    slug: string;
};

export type SearchNote = {
    _id: string;
    chapterId: {
        _id: string;
        chapterNumber: number;
        name: string;
        subjectId: string;
    };
    title: string;
    content: string;
    language: string;
};

export type SearchVideo = {
    _id: string;
    chapterId: {
        _id: string;
        chapterNumber: number;
        name: string;
        subjectId: string;
    };
    title: string;
    youtubeVideoId: string;
    channelName: string;
    language: string;
};

export type SearchQuestion = {
    _id: string;
    chapterId: {
        _id: string;
        chapterNumber: number;
        name: string;
        subjectId: string;
    };
    question: string;
    options: string[];
    explanation: string;
};

export type SearchData = {
    classes: SearchClass[];
    subjects: SearchSubject[];
    chapters: SearchChapter[];
    notes: SearchNote[];
    videos: SearchVideo[];
    questions: SearchQuestion[];
};

export type SearchResponse = {
    success: boolean;
    data: SearchData;
};