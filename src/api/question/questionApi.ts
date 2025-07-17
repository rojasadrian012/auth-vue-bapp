import { api } from "../apiBase"
import type { ICbiQuestionResult, ITestSubmissionApi } from "./question.types"

export interface ITestResultApi {
  personalBurnout: number
  workBurnout: number
  clientBurnout: number
  overallScore: number
  interpretation: string
  recommendations?: string[]
}

export const getCbiQuestionsFn = async (): Promise<ICbiQuestionResult> => {
  const response = api.get<ICbiQuestionResult>("questions")
  return (await response).data
}


export const submitCbiTestFn = async (submission: ITestSubmissionApi): Promise<ITestResultApi> => {
  const response = await api.post<ITestResultApi>("questions/cbi/create", submission)
  console.log(response.data);
  

  return new Promise<ITestResultApi>((resolve, reject) => {
    setTimeout(() => {
      const mockResult: ITestResultApi = {
        personalBurnout: 3,
        workBurnout: 4,
        clientBurnout: 2,
        overallScore: 3,
        interpretation: 'Moderate burnout risk',
        recommendations: ['Take regular breaks', 'Seek support from colleagues']
      };
      resolve(mockResult);
    }, 500);

    });
};

