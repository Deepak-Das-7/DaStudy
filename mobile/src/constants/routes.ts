export const ROUTES = {
    HOME: "/",
    CLASSES: "/classes",
    SUBJECTS: "/subjects",
    CHAPTERS: "/chapters",
    SEARCH: "/search",
    BOOKMARKS: "/bookmarks",

    CHAPTER: (id: string) =>
        `/chapter/${id}` as const,

    CHAPTER_NOTES: "/chapter/notes",
    CHAPTER_VIDEOS: "/chapter/videos",
    CHAPTER_QUESTIONS: "/chapter/questions",
    QUIZ_RESULT: "/chapter/quiz-result",
} as const;