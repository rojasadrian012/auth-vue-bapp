import { api } from "../apiBase"
import type { ICbiQuestionResult } from "./question.types"

export interface ITestSubmissionApi {
  answers: Record<number, number>
  completedAt: string
  totalQuestions: number
}

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


export const submitCbiTest = async (submission: ITestSubmissionApi): Promise<ITestResultApi> => {
  console.log('Submitting CBI test:', submission);

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

    /*try {
      const response = await fetch('/api/cbi-test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Incluir token de autenticación si es necesario
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(submission)
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const result: ApiResponse<TestResult> = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Error al procesar el test')
      }
  
      return result.data
    } catch (error) {
      console.error('Error submitting test:', error)
      throw error
    }*/
  });
};

