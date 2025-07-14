export interface ICbiQuestionResult {
    message: string;
    count:   number;
    data:    Question[];
}

export interface Question {
    question:   string;
    questionEn: string;
    options:    Option[];
    id:         string;
    created_at: Date;
    updated_at: Date;
}

export interface Option {
    label:      string;
    labelEn:    string;
    id:         string;
    created_at: Date;
    updated_at: Date;
}
