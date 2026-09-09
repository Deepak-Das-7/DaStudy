export type QuestionItem = {
    _id: string;
    chapterId: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    language: string;
    order: number;
};

export type QuestionsResponse = {
    success: boolean;
    data: QuestionItem[];
};