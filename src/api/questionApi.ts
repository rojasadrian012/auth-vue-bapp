export interface TestSubmission {
    answers: Record<number, number>
    completedAt: string
    totalQuestions: number
}

export interface TestResult {
    personalBurnout: number
    workBurnout: number
    clientBurnout: number
    overallScore: number
    interpretation: string
    recommendations?: string[]
}

export const submitCbiTest = async (submission: TestSubmission): Promise<TestResult> => {
    console.log('Submitting CBI test:', submission);
    
    return new Promise<TestResult>((resolve, reject) => {
        setTimeout(() => {
            const mockResult: TestResult = {
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