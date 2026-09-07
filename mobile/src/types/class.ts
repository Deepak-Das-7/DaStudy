export type ClassItem = {
    _id: string;
    classNumber: number;
    name: string;
    subjectCount: number;
};

export type ClassesResponse = {
    success: boolean;
    data: ClassItem[];
};