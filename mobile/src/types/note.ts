export type NoteItem = {
    _id: string;
    chapterId: string;
    title: string;
    content: string;
    language: string;
};

export type NotesResponse = {
    success: boolean;
    data: NoteItem[];
};