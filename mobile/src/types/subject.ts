export type SubjectItem = {
    _id: string;
    classId: string;
    name: string;
    slug: string;
};

export type SubjectsResponse = {
    success: boolean;
    data: SubjectItem[];
};