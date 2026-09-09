export type NoteItem = {
    _id: string;
    chapterId: string;
    title: string;
    content: string;
    language: string;
    order: number;
};

export type NotesResponse = {
    success: boolean;
    data: NoteItem[];
};