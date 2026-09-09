type ValidationError = {
    type: string;
    message: string;
};

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

const errors: ValidationError[] = [];

const addError = (
    type: string,
    message: string
): void => {
    errors.push({
        type,
        message,
    });
};

const validateLanguage = (
    language: string,
    location: string
): void => {
    if (!["en", "hi"].includes(language)) {
        addError(
            "INVALID_LANGUAGE",
            `${location}: language must be "en" or "hi".`
        );
    }
};

const validateChapterData = (
    classNumber: number,
    data: ChapterSubjectData[]
): void => {
    const subjectSlugs = new Set<string>();

    for (const subjectData of data) {
        if (subjectSlugs.has(subjectData.subjectSlug)) {
            addError(
                "DUPLICATE_SUBJECT",
                `Class ${classNumber}: duplicate subject slug "${subjectData.subjectSlug}".`
            );
        }

        subjectSlugs.add(subjectData.subjectSlug);

        const chapterNumbers = new Set<number>();
        const chapterSlugs = new Set<string>();

        for (const chapter of subjectData.chapters) {
            const location =
                `Class ${classNumber} / ${subjectData.subjectSlug} / ${chapter.slug}`;

            if (!chapter.name.trim()) {
                addError(
                    "EMPTY_CHAPTER_NAME",
                    `${location}: chapter name cannot be empty.`
                );
            }

            if (!chapter.slug.trim()) {
                addError(
                    "EMPTY_CHAPTER_SLUG",
                    `${location}: chapter slug cannot be empty.`
                );
            }

            if (chapterNumbers.has(chapter.chapterNumber)) {
                addError(
                    "DUPLICATE_CHAPTER_NUMBER",
                    `${location}: duplicate chapter number ${chapter.chapterNumber}.`
                );
            }

            if (chapterSlugs.has(chapter.slug)) {
                addError(
                    "DUPLICATE_CHAPTER_SLUG",
                    `${location}: duplicate chapter slug "${chapter.slug}".`
                );
            }

            if (chapter.chapterNumber < 1) {
                addError(
                    "INVALID_CHAPTER_NUMBER",
                    `${location}: chapter number must be >= 1.`
                );
            }

            validateLanguage(
                chapter.language,
                location
            );

            chapterNumbers.add(chapter.chapterNumber);
            chapterSlugs.add(chapter.slug);
        }
    }
};

const validateNoteData = (
    classNumber: number,
    data: NoteChapterData[]
): void => {
    for (const chapterData of data) {
        const orders = new Set<number>();

        for (const note of chapterData.notes) {
            const location =
                `Class ${classNumber} / ${chapterData.subjectSlug} / ${chapterData.chapterSlug} / note "${note.title}"`;

            if (!note.title.trim()) {
                addError(
                    "EMPTY_NOTE_TITLE",
                    `${location}: title cannot be empty.`
                );
            }

            if (!note.content.trim()) {
                addError(
                    "EMPTY_NOTE_CONTENT",
                    `${location}: content cannot be empty.`
                );
            }

            if (orders.has(note.order)) {
                addError(
                    "DUPLICATE_NOTE_ORDER",
                    `${location}: duplicate note order ${note.order}.`
                );
            }

            if (note.order < 1) {
                addError(
                    "INVALID_NOTE_ORDER",
                    `${location}: order must be >= 1.`
                );
            }

            validateLanguage(
                note.language,
                location
            );

            orders.add(note.order);
        }
    }
};

const validateVideoData = (
    classNumber: number,
    data: VideoChapterData[]
): void => {
    for (const chapterData of data) {
        const orders = new Set<number>();

        for (const video of chapterData.videos) {
            const location =
                `Class ${classNumber} / ${chapterData.subjectSlug} / ${chapterData.chapterSlug} / video "${video.title}"`;

            if (!video.title.trim()) {
                addError(
                    "EMPTY_VIDEO_TITLE",
                    `${location}: title cannot be empty.`
                );
            }

            if (!video.youtubeVideoId.trim()) {
                addError(
                    "EMPTY_YOUTUBE_ID",
                    `${location}: youtubeVideoId cannot be empty.`
                );
            }

            if (!video.channelName.trim()) {
                addError(
                    "EMPTY_CHANNEL_NAME",
                    `${location}: channelName cannot be empty.`
                );
            }

            if (orders.has(video.order)) {
                addError(
                    "DUPLICATE_VIDEO_ORDER",
                    `${location}: duplicate video order ${video.order}.`
                );
            }

            if (video.order < 1) {
                addError(
                    "INVALID_VIDEO_ORDER",
                    `${location}: order must be >= 1.`
                );
            }

            validateLanguage(
                video.language,
                location
            );

            orders.add(video.order);
        }
    }
};

const validateQuestionData = (
    classNumber: number,
    data: QuestionChapterData[]
): void => {
    for (const chapterData of data) {
        const orders = new Set<number>();

        for (const question of chapterData.questions) {
            const location =
                `Class ${classNumber} / ${chapterData.subjectSlug} / ${chapterData.chapterSlug} / question "${question.question}"`;

            if (!question.question.trim()) {
                addError(
                    "EMPTY_QUESTION",
                    `${location}: question cannot be empty.`
                );
            }

            if (question.options.length < 2) {
                addError(
                    "INVALID_OPTIONS",
                    `${location}: question must have at least 2 options.`
                );
            }

            if (
                question.correctAnswer < 0 ||
                question.correctAnswer >= question.options.length
            ) {
                addError(
                    "INVALID_CORRECT_ANSWER",
                    `${location}: correctAnswer ${question.correctAnswer} is outside the options range.`
                );
            }

            if (!question.explanation.trim()) {
                addError(
                    "EMPTY_EXPLANATION",
                    `${location}: explanation cannot be empty.`
                );
            }

            if (orders.has(question.order)) {
                addError(
                    "DUPLICATE_QUESTION_ORDER",
                    `${location}: duplicate question order ${question.order}.`
                );
            }

            if (question.order < 1) {
                addError(
                    "INVALID_QUESTION_ORDER",
                    `${location}: order must be >= 1.`
                );
            }

            validateLanguage(
                question.language,
                location
            );

            orders.add(question.order);
        }
    }
};

export const validateSeedContent = (params: {
    chapterSources: {
        classNumber: number;
        data: ChapterSubjectData[];
    }[];

    noteSources: {
        classNumber: number;
        data: NoteChapterData[];
    }[];

    videoSources: {
        classNumber: number;
        data: VideoChapterData[];
    }[];

    questionSources: {
        classNumber: number;
        data: QuestionChapterData[];
    }[];
}): void => {
    errors.length = 0;

    for (const source of params.chapterSources) {
        validateChapterData(
            source.classNumber,
            source.data
        );
    }

    for (const source of params.noteSources) {
        validateNoteData(
            source.classNumber,
            source.data
        );
    }

    for (const source of params.videoSources) {
        validateVideoData(
            source.classNumber,
            source.data
        );
    }

    for (const source of params.questionSources) {
        validateQuestionData(
            source.classNumber,
            source.data
        );
    }

    if (errors.length > 0) {
        console.error("");
        console.error("================================");
        console.error("CONTENT VALIDATION FAILED");
        console.error("================================");

        for (const error of errors) {
            console.error(
                `[${error.type}] ${error.message}`
            );
        }

        console.error("");
        console.error(
            `Total validation errors: ${errors.length}`
        );

        console.error("================================");

        throw new Error(
            `Content validation failed with ${errors.length} error(s).`
        );
    }

    console.log("");
    console.log("================================");
    console.log("CONTENT VALIDATION PASSED");
    console.log("================================");
};