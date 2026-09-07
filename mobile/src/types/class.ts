export type ClassItem = {
    _id: string;
    classNumber: number;
    name: string;
};

export type ClassesResponse = {
    success: boolean;
    data: ClassItem[];
};