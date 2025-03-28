import React, { useState, useEffect } from 'react';
import { geminiChatService } from '../services/geminiChatService';

export const GeminiApiTest: React.FC = () => {
  const [status, setStatus] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const testApiKey = async () => {
      try {
        setIsLoading(true);
        const result = await geminiChatService.testApiKey();
        setStatus(result);
      } catch (error) {
        setStatus({
          isValid: false,
          message: 'An unexpected error occurred while testing the API key.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    testApiKey();
  }, []);

  return (
    <div className="p-6 glass-effect rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Gemini API Status
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-2">Testing API connection...</span>
        </div>
      ) : status ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${status.isValid ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
            <div className="flex items-center">
              {status.isValid ? (
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              <span className={status.isValid ? 'text-green-500' : 'text-red-500'}>
                {status.isValid ? 'API Key is Valid' : 'API Key is Invalid'}
              </span>
            </div>
            <p className="mt-2 text-gray-200">{status.message}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              {status.isValid 
                ? 'Your Gemini AI integration is working correctly.' 
                : 'Please update your API key in the .env file to enable the Gemini AI integration.'}
            </p>

            {!status.isValid && (
              <div className="space-y-2">
                <h3 className="font-semibold">Steps to get a Gemini API key:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                  <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google AI Studio</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click on "Get API key"</li>
                  <li>Add the API key to your .env file as VITE_GEMINI_API_KEY=your_api_key_here</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Unable to test the API key. Please try again later.</p>
      )}
    </div>
  );
}; 