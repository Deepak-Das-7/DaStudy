import { router } from "expo-router";
import { ROUTES, } from "../constants/routes";
import { ChapterNavigationParams, } from "../types/navigation";

export const goToClasses =
    (): void => {
        router.push(ROUTES.CLASSES);
    };

export const goToSearch =
    (): void => {
        router.push(ROUTES.SEARCH);
    };

export const goToBookmarks =
    (): void => {
        router.push(ROUTES.BOOKMARKS);
    };

export const goToChapter =
    (chapterId: string): void => {
        router.push(
            ROUTES.CHAPTER(chapterId)
        );
    };

export const goToNotes = (
    params: ChapterNavigationParams
): void => {
    router.push({
        pathname: ROUTES.CHAPTER_NOTES,
        params,
    });
};

export const goToVideos = (
    params: ChapterNavigationParams
): void => {
    router.push({
        pathname: ROUTES.CHAPTER_VIDEOS,
        params,
    });
};

export const goToQuestions = (
    params: ChapterNavigationParams
): void => {
    router.push({
        pathname: ROUTES.CHAPTER_QUESTIONS,
        params,
    });
};