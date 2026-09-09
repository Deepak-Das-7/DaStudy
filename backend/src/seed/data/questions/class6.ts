import type { QuestionChapterSeed } from "../../types/seedTypes";

export const class6QuestionData: QuestionChapterSeed[] = [{
    subjectSlug: "mathematics",
    chapterSlug: "knowing-our-numbers",

    questions: [
        {
            question:
                "Which digit is in the hundreds place in 4,582?",
            options: ["4", "5", "8", "2"],
            correctAnswer: 1,
            explanation:
                "In 4,582, the digit 5 is in the hundreds place.",
            language: "en",
            order: 1,
            isPublished: true,
        },

        {
            question: "Which number is greater?",
            options: ["3,245", "3,425", "3,254", "3,245"],
            correctAnswer: 1,
            explanation:
                "3,425 is greater than 3,245 and 3,254.",
            language: "en",
            order: 2,
            isPublished: true,
        },

        {
            question:
                "How many digits are there in 25,678?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            explanation:
                "The number 25,678 contains five digits.",
            language: "en",
            order: 3,
            isPublished: true,
        },
    ],
},

{
    subjectSlug: "science",
    chapterSlug: "food-and-its-sources",

    questions: [
        {
            question:
                "Which of the following is a plant source of food?",
            options: ["Rice", "Egg", "Fish", "Milk"],
            correctAnswer: 0,
            explanation:
                "Rice is obtained from a plant and is therefore a plant source of food.",
            language: "en",
            order: 1,
            isPublished: true,
        },

        {
            question:
                "Which of the following is obtained from an animal?",
            options: ["Wheat", "Rice", "Milk", "Potato"],
            correctAnswer: 2,
            explanation:
                "Milk is obtained from animals such as cows and buffaloes.",
            language: "en",
            order: 2,
            isPublished: true,
        },

        {
            question:
                "Which part of a plant can be used as food?",
            options: [
                "Only roots",
                "Only leaves",
                "Only fruits",
                "Different parts can be used as food",
            ],
            correctAnswer: 3,
            explanation:
                "Different plants provide different edible parts such as roots, stems, leaves, fruits, and seeds.",
            language: "en",
            order: 3,
            isPublished: true,
        },
    ],
},
];