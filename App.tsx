import React, { useState, useCallback } from 'react';
import { generateSocialMediaPlan } from './services/geminiService';
import Spinner from './components/Spinner';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [businessDescription, setBusinessDescription] = useState<string>('');
  const [socialMediaPlan, setSocialMediaPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async () => {
    if (!businessDescription.trim()) {
      setError('Please enter a business description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSocialMediaPlan('');

    try {
      const plan = await generateSocialMediaPlan(businessDescription);
      setSocialMediaPlan(plan);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      // Provide a more specific error message if the API key is missing.
      if (errorMessage.includes("API key not configured")) {
        setError('Configuration needed: Please add your Google Gemini API key to the `services/geminiService.ts` file.');
      } else {
        setError('Failed to generate social media plan. This could be due to an invalid API key, network issues, or a problem with the service. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [businessDescription]);

  return (
    <div className="min-h-screen font-lato text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-lora text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Dumble's Door AI Presents:
          </h1>
          <h2 className="font-lora text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600 mt-2">
            The One-Click Social Media Kit
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your business type and location below to get a free, custom 7-day social media plan in seconds.
          </p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex flex-col space-y-4">
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="e.g., A specialty coffee shop in Kolkata"
              className="w-full h-28 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out resize-none font-lato"
              disabled={isLoading}
            />
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="w-full sm:w-auto self-center sm:self-end flex items-center justify-center px-8 py-3 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                'Generate My Plan'
              )}
            </button>
          </div>
        </main>

        <section id="results" className="mt-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 min-h-[200px]">
                <Spinner size="large" />
                <p className="mt-4 text-gray-600 font-semibold">Generating your custom plan...</p>
            </div>
          )}

          {socialMediaPlan && !isLoading && (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
              <ResultDisplay markdownContent={socialMediaPlan} />
            </div>
          )}
        </section>
      </div>
       <footer className="text-center mt-12 py-4">
            <p className="text-sm text-gray-500">Powered by Dumble's Door AI & Google Gemini</p>
        </footer>
    </div>
  );
};

export default App;