
export interface ICbiQuestionResult {
    status: string;
    count: number;
    data: Data;
}

interface Data {
    questions: Question[];
}

interface Question {
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

export interface ITestSubmissionApi {
    answers: Record<string, string>
    completedAt: string
    totalQuestions: number
}
