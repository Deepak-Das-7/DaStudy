export type VideoItem = {
    _id: string;
    chapterId: string;
    title: string;
    youtubeVideoId: string;
    channelName: string;
    language: string;
    order: number;
};

export type VideosResponse = {
    success: boolean;
    data: VideoItem[];
};