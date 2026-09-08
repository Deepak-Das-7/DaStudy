import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    BookmarkItem,
} from "../types/bookmark";

const BOOKMARKS_STORAGE_KEY =
    "@dastudy/bookmarks";

export const getBookmarks =
    async (): Promise<BookmarkItem[]> => {
        try {
            const storedBookmarks =
                await AsyncStorage.getItem(
                    BOOKMARKS_STORAGE_KEY
                );

            if (!storedBookmarks) {
                return [];
            }

            const parsedBookmarks =
                JSON.parse(storedBookmarks);

            if (!Array.isArray(parsedBookmarks)) {
                return [];
            }

            return parsedBookmarks;
        } catch (error) {
            console.error(
                "Failed to load bookmarks:",
                error
            );

            return [];
        }
    };

export const saveBookmarks = async (
    bookmarks: BookmarkItem[]
): Promise<void> => {
    try {
        await AsyncStorage.setItem(
            BOOKMARKS_STORAGE_KEY,
            JSON.stringify(bookmarks)
        );
    } catch (error) {
        console.error(
            "Failed to save bookmarks:",
            error
        );

        throw error;
    }
};

export const isBookmarked = async (
    id: string
): Promise<boolean> => {
    const bookmarks =
        await getBookmarks();

    return bookmarks.some(
        (bookmark) => bookmark.id === id
    );
};

export const addBookmark = async (
    bookmark: BookmarkItem
): Promise<void> => {
    const bookmarks =
        await getBookmarks();

    const alreadyExists =
        bookmarks.some(
            (item) => item.id === bookmark.id
        );

    if (alreadyExists) {
        return;
    }

    const updatedBookmarks = [
        bookmark,
        ...bookmarks,
    ];

    await saveBookmarks(updatedBookmarks);
};

export const removeBookmark = async (
    id: string
): Promise<void> => {
    const bookmarks =
        await getBookmarks();

    const updatedBookmarks =
        bookmarks.filter(
            (bookmark) => bookmark.id !== id
        );

    await saveBookmarks(updatedBookmarks);
};

export const toggleBookmark = async (
    bookmark: BookmarkItem
): Promise<boolean> => {
    const bookmarks =
        await getBookmarks();

    const exists = bookmarks.some(
        (item) => item.id === bookmark.id
    );

    if (exists) {
        await removeBookmark(bookmark.id);
        return false;
    }

    await addBookmark(bookmark);
    return true;
};