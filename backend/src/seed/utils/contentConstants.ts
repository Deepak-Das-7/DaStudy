export const CONTENT_LANGUAGES = [
    "en",
    "hi",
] as const;

export type ContentLanguage =
    (typeof CONTENT_LANGUAGES)[number];