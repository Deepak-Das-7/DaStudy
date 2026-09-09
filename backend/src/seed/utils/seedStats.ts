export type SeedStats = {
    classes: number;
    subjects: number;
    chapters: number;
    notes: number;
    videos: number;
    questions: number;
};

export const createEmptySeedStats = (): SeedStats => ({
    classes: 0,
    subjects: 0,
    chapters: 0,
    notes: 0,
    videos: 0,
    questions: 0,
});

export const printSeedStats = (
    stats: SeedStats
): void => {
    console.log("");
    console.log("================================");
    console.log("Database seed completed");
    console.log("================================");

    console.log(
        `Classes:    ${stats.classes}`
    );

    console.log(
        `Subjects:   ${stats.subjects}`
    );

    console.log(
        `Chapters:   ${stats.chapters}`
    );

    console.log(
        `Notes:      ${stats.notes}`
    );

    console.log(
        `Videos:     ${stats.videos}`
    );

    console.log(
        `Questions:  ${stats.questions}`
    );

    console.log("================================");
};