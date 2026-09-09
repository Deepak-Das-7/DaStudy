export type ChapterItem = {
    _id: string;
    subjectId: string;
    chapterNumber: number;
    name: string;
    slug: string;
    description?: string;
    language: string;
};

export type ChaptersResponse = {
    success: boolean;
    data: ChapterItem[];
};

export type ChapterResponse = {
    success: boolean;
    data: ChapterItem;
};