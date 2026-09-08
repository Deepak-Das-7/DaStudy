export type BookmarkType =
    | "chapter"
    | "note"
    | "video"
    | "question";

export type BookmarkItem = {
    id: string;
    type: BookmarkType;
    title: string;
    subtitle?: string;
    chapterId?: string;
    createdAt: string;
};