import {
    CONTENT_LANGUAGES,
} from "../utils/contentConstants";

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

type ClassData = {
    classNumber: number;
    name: string;
};

type SubjectData = {
    name: string;
    slug: string;
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
    if (
        !CONTENT_LANGUAGES.includes(
            language as (typeof CONTENT_LANGUAGES)[number]
        )
    ) {
        addError(
            "INVALID_LANGUAGE",
            `${location}: language must be one of ${CONTENT_LANGUAGES.join(
                ", "
            )}.`
        );
    }
};
/* =========================================================
   CLASS VALIDATION
========================================================= */

const validateClasses = (
    classData: ClassData[]
): void => {
    const classNumbers = new Set<number>();

    for (const classItem of classData) {
        if (classNumbers.has(classItem.classNumber)) {
            addError(
                "DUPLICATE_CLASS",
                `Class ${classItem.classNumber}: duplicate class number.`
            );
        }

        if (
            classItem.classNumber < 1 ||
            classItem.classNumber > 12
        ) {
            addError(
                "INVALID_CLASS_NUMBER",
                `Class ${classItem.classNumber}: class number must be between 1 and 12.`
            );
        }

        if (!classItem.name.trim()) {
            addError(
                "EMPTY_CLASS_NAME",
                `Class ${classItem.classNumber}: class name cannot be empty.`
            );
        }

        classNumbers.add(classItem.classNumber);
    }
};

/* =========================================================
   SUBJECT VALIDATION
========================================================= */

const validateSubjects = (
    subjectData: SubjectData[]
): void => {
    const subjectSlugs = new Set<string>();

    for (const subject of subjectData) {
        if (!subject.name.trim()) {
            addError(
                "EMPTY_SUBJECT_NAME",
                "Subject name cannot be empty."
            );
        }

        if (!subject.slug.trim()) {
            addError(
                "EMPTY_SUBJECT_SLUG",
                "Subject slug cannot be empty."
            );
        }

        if (subjectSlugs.has(subject.slug)) {
            addError(
                "DUPLICATE_SUBJECT",
                `Duplicate subject slug "${subject.slug}".`
            );
        }

        subjectSlugs.add(subject.slug);
    }
};

/* =========================================================
   CHAPTER VALIDATION
========================================================= */

const validateChapterData = (
    classNumber: number,
    data: ChapterSubjectData[]
): void => {
    const subjectSlugs = new Set<string>();

    for (const subjectData of data) {
        if (subjectSlugs.has(subjectData.subjectSlug)) {
            addError(
                "DUPLICATE_CHAPTER_SUBJECT",
                `Class ${classNumber}: duplicate chapter source for subject "${subjectData.subjectSlug}".`
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

/* =========================================================
   NOTE VALIDATION
========================================================= */

const validateNoteData = (
    classNumber: number,
    data: NoteChapterData[]
): void => {
    const chapterReferences = new Set<string>();

    for (const chapterData of data) {
        const chapterReference =
            `${chapterData.subjectSlug}:${chapterData.chapterSlug}`;

        if (chapterReferences.has(chapterReference)) {
            addError(
                "DUPLICATE_NOTE_CHAPTER",
                `Class ${classNumber}: duplicate note source for ${chapterReference}.`
            );
        }

        chapterReferences.add(chapterReference);

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

/* =========================================================
   VIDEO VALIDATION
========================================================= */

const validateVideoData = (
    classNumber: number,
    data: VideoChapterData[]
): void => {
    const chapterReferences = new Set<string>();

    for (const chapterData of data) {
        const chapterReference =
            `${chapterData.subjectSlug}:${chapterData.chapterSlug}`;

        if (chapterReferences.has(chapterReference)) {
            addError(
                "DUPLICATE_VIDEO_CHAPTER",
                `Class ${classNumber}: duplicate video source for ${chapterReference}.`
            );
        }

        chapterReferences.add(chapterReference);

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

/* =========================================================
   QUESTION VALIDATION
========================================================= */

const validateQuestionData = (
    classNumber: number,
    data: QuestionChapterData[]
): void => {
    const chapterReferences = new Set<string>();

    for (const chapterData of data) {
        const chapterReference =
            `${chapterData.subjectSlug}:${chapterData.chapterSlug}`;

        if (chapterReferences.has(chapterReference)) {
            addError(
                "DUPLICATE_QUESTION_CHAPTER",
                `Class ${classNumber}: duplicate question source for ${chapterReference}.`
            );
        }

        chapterReferences.add(chapterReference);

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

/* =========================================================
   RELATIONSHIP VALIDATION
========================================================= */

const validateChapterReferences = (
    classData: ClassData[],
    subjectData: SubjectData[],
    chapterSources: {
        classNumber: number;
        data: ChapterSubjectData[];
    }[]
): void => {
    const classes = new Set(
        classData.map(
            (item) => item.classNumber
        )
    );

    const subjects = new Set(
        subjectData.map(
            (item) => item.slug
        )
    );

    for (const source of chapterSources) {
        if (!classes.has(source.classNumber)) {
            addError(
                "MISSING_CLASS_REFERENCE",
                `Chapter source references Class ${source.classNumber}, but that class does not exist.`
            );

            continue;
        }

        for (const subject of source.data) {
            if (!subjects.has(subject.subjectSlug)) {
                addError(
                    "MISSING_SUBJECT_REFERENCE",
                    `Class ${source.classNumber}: subject "${subject.subjectSlug}" does not exist.`
                );
            }
        }
    }
};

const buildChapterReferenceSet = (
    chapterSources: {
        classNumber: number;
        data: ChapterSubjectData[];
    }[]
): Set<string> => {
    const references = new Set<string>();

    for (const source of chapterSources) {
        for (const subject of source.data) {
            for (const chapter of subject.chapters) {
                references.add(
                    `${source.classNumber}:${subject.subjectSlug}:${chapter.slug}`
                );
            }
        }
    }

    return references;
};

const validateContentReferences = (
    chapterSources: {
        classNumber: number;
        data: ChapterSubjectData[];
    }[],
    noteSources: {
        classNumber: number;
        data: NoteChapterData[];
    }[],
    videoSources: {
        classNumber: number;
        data: VideoChapterData[];
    }[],
    questionSources: {
        classNumber: number;
        data: QuestionChapterData[];
    }[]
): void => {
    const chapterReferences =
        buildChapterReferenceSet(chapterSources);

    for (const source of noteSources) {
        for (const chapter of source.data) {
            const reference =
                `${source.classNumber}:${chapter.subjectSlug}:${chapter.chapterSlug}`;

            if (!chapterReferences.has(reference)) {
                addError(
                    "ORPHAN_NOTE_REFERENCE",
                    `Notes reference a chapter that does not exist: ${reference}.`
                );
            }
        }
    }

    for (const source of videoSources) {
        for (const chapter of source.data) {
            const reference =
                `${source.classNumber}:${chapter.subjectSlug}:${chapter.chapterSlug}`;

            if (!chapterReferences.has(reference)) {
                addError(
                    "ORPHAN_VIDEO_REFERENCE",
                    `Videos reference a chapter that does not exist: ${reference}.`
                );
            }
        }
    }

    for (const source of questionSources) {
        for (const chapter of source.data) {
            const reference =
                `${source.classNumber}:${chapter.subjectSlug}:${chapter.chapterSlug}`;

            if (!chapterReferences.has(reference)) {
                addError(
                    "ORPHAN_QUESTION_REFERENCE",
                    `Questions reference a chapter that does not exist: ${reference}.`
                );
            }
        }
    }
};

/* =========================================================
   PUBLIC VALIDATOR
========================================================= */

export const validateSeedContent = (params: {
    classData: ClassData[];

    subjectData: SubjectData[];

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

    validateClasses(
        params.classData
    );

    validateSubjects(
        params.subjectData
    );

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

    validateChapterReferences(
        params.classData,
        params.subjectData,
        params.chapterSources
    );

    validateContentReferences(
        params.chapterSources,
        params.noteSources,
        params.videoSources,
        params.questionSources
    );

    if (errors.length > 0) {
        console.error("");
        console.error(
            "================================"
        );
        console.error(
            "CONTENT VALIDATION FAILED"
        );
        console.error(
            "================================"
        );

        for (const error of errors) {
            console.error(
                `[${error.type}] ${error.message}`
            );
        }

        console.error("");

        console.error(
            `Total validation errors: ${errors.length}`
        );

        console.error(
            "================================"
        );

        throw new Error(
            `Content validation failed with ${errors.length} error(s).`
        );
    }

    console.log("");
    console.log(
        "================================"
    );
    console.log(
        "CONTENT VALIDATION PASSED"
    );
    console.log(
        "================================"
    );
};