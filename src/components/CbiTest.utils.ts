export interface Question {
    id: string;
    created_at: Date;
    updated_at: Date;
    question: string;
    questionEn: string;
    options: Option[];
}

interface Option {
    id: string;
    created_at: Date;
    updated_at: Date;
    label: string;
    labelEn: string;
}

