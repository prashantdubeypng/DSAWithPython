import { useState, useCallback } from "react";
import Head from "next/head";

// API Configuration
const API_URL = "https://dsawithpython-production.up.railway.app/predict";

/**
 * Main prediction page component
 * Handles user input, API calls, and displays ranked predictions
 */
export default function Home() {
  // Input state
  const [inputText, setInputText] = useState("");
  const [topK, setTopK] = useState(5);
  const [temperature, setTemperature] = useState(0.8);

  // API state
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calls the prediction API with current parameters
   * @param {string} text - The input text to predict from
   */
  const fetchPredictions = useCallback(
    async (text) => {
      // Don't call API for empty input
      if (!text.trim()) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            top_k: topK,
            temperature: temperature,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPredictions(data.predictions || []);
      } catch (err) {
        console.error("Prediction error:", err);
        setError(err.message || "Failed to fetch predictions. Please try again.");
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [topK, temperature]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPredictions(inputText);
  };

  /**
   * Handle clicking a prediction token
   * Appends the token to input and re-runs prediction
   */
  const handlePredictionClick = (token) => {
    // Clean up the token (remove leading space if input already ends with space)
    const cleanToken = inputText.endsWith(" ") ? token.trimStart() : token;
    const newText = inputText + cleanToken;
    setInputText(newText);
    // Auto-predict with the new text
    fetchPredictions(newText);
  };

  /**
   * Format probability as percentage
   */
  const formatProbability = (prob) => {
    return (prob * 100).toFixed(1) + "%";
  };

  /**
   * Clean token display (handle subword tokens)
   */
  const formatToken = (token) => {
    // Remove leading special characters but preserve the actual token
    return token.replace(/^[Ġ▁]/, " ").replace(/^\s+/, " ");
  };

  return (
    <>
      <Head>
        <title>Next Word Predictor | LSTM Language Model</title>
        <meta
          name="description"
          content="AI-powered next word prediction using LSTM neural networks"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-dark-900 text-white">
        {/* Background gradient effect */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-700 border border-dark-600 text-xs font-medium text-gray-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              LSTM Model Active
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Next Word Predictor
            </h1>
            <p className="mt-4 text-gray-400 max-w-md mx-auto">
              Type a sentence and let the neural network predict what comes next.
              Click any prediction to continue the sequence.
            </p>
          </header>

          {/* Main Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Input */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Start typing a sentence..."
                rows={3}
                className="w-full px-4 py-4 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-lg"
              />
              {inputText && (
                <button
                  type="button"
                  onClick={() => {
                    setInputText("");
                    setPredictions([]);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-md text-gray-500 hover:text-white hover:bg-dark-600 transition-colors"
                  aria-label="Clear input"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Top-K Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">
                    Top-K Results
                  </label>
                  <span className="text-sm font-mono text-purple-400">{topK}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider-purple"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">
                    Temperature
                  </label>
                  <span className="text-sm font-mono text-purple-400">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.5}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider-purple"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.2 (focused)</span>
                  <span>1.5 (creative)</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Predicting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Predict Next Words
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-xl">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-red-400">Prediction Failed</h3>
                  <p className="text-sm text-red-300/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Predictions List */}
          {predictions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Predictions (click to append)
              </h2>
              <div className="space-y-3">
                {predictions.map((prediction, index) => (
                  <button
                    key={index}
                    onClick={() => handlePredictionClick(prediction.token)}
                    className="w-full group"
                  >
                    <div className="p-4 bg-dark-800 border border-dark-600 rounded-xl hover:border-purple-500/50 hover:bg-dark-700 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {/* Rank badge */}
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-dark-600 text-xs font-medium text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            {index + 1}
                          </span>
                          {/* Token display */}
                          <span className="font-mono text-lg text-white group-hover:text-purple-300 transition-colors">
                            "{formatToken(prediction.token)}"
                          </span>
                        </div>
                        {/* Probability percentage */}
                        <span className="text-sm font-mono text-gray-400">
                          {formatProbability(prediction.probability)}
                        </span>
                      </div>
                      {/* Probability bar */}
                      <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(prediction.probability * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {!isLoading && !error && predictions.length === 0 && inputText.trim() && (
            <div className="mt-8 text-center text-gray-500">
              <p>Press the button to see predictions</p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-dark-700 text-center">
            <p className="text-sm text-gray-500">
              Powered by LSTM Neural Network • Built with FastAPI & Next.js
            </p>
          </footer>
        </div>
      </main>

      {/* Custom slider styles */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          cursor: pointer;
          border: 2px solid #1a1a1a;
          box-shadow: 0 2px 6px rgba(168, 85, 247, 0.3);
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 10px rgba(168, 85, 247, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          cursor: pointer;
          border: 2px solid #1a1a1a;
          box-shadow: 0 2px 6px rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </>
  );
}
