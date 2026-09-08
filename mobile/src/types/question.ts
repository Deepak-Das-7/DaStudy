export type QuestionItem = {
    _id: string;
    chapterId: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
};

export type QuestionsResponse = {
    success: boolean;
    data: QuestionItem[];
};